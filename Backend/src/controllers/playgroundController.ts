import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Playground from "../models/playgroundModel";
import Review from "../models/reviewModel";
import mongoose from "mongoose";

export const addNewPlayground = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "fail",
          message: "You need to be logged in to add a playground.",
        });
      }
      if (["admin", "owner", "user"].indexOf(req.user.role) === -1) {
        return res.status(403).json({
          status: "fail",
          message: "You are not authorized to add a playground.",
        });
      }
      // Validate required fields
      const { name, address, size, price } = req.body;
      let images: any = [];
      if (req.files) {
        images = req.files.map((file: any) => file.path);
      }
      if (!name || !address || !size || !price) {
        return res.status(400).json({
          status: "fail",
          message:
            "Name, address, and at least one image are required to add a playground.",
        });
      }
      const playground = await Playground.create({
        ...req.body,
        images,
        ownerId: req.user._id,
      });
      return res.status(201).json({
        status: "success",
        message: "Playground added successfully.",
        playground,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

export const getAllPlaygrounds = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;

    // Aggregation pipeline to get playgrounds with their average rating
    const playgrounds = await Playground.aggregate([
      { $match: { suspended: false } }, // Only get non-suspended playgrounds
      {
        $lookup: {
          from: "reviews", // 'reviews' is the collection name
          localField: "_id",
          foreignField: "playgroundId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: {
                $divide: [{ $sum: "$reviews.rating" }, { $size: "$reviews" }],
              },
              else: 0,
            },
          },
        },
      },
      { $skip: (page - 1) * 5 }, // Pagination: Skip documents based on page number
      { $limit: 5 }, // Limit the number of results per page
      { $sort: { createdAt: -1 } }
    ]);

    const count = await Playground.countDocuments({ suspended: false });

    return res.status(200).json({
      status: "success",
      playgrounds,
      meta:{
        page,
        total_results: count,
        per_page:5,
        total_pages:  Math.ceil( count / 5 ) + (count%5 == 0 ? 0 : 1)
      }
    });
  }
);

export const getPlaygroundById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid playground ID.",
      });
    }

    const playground = await Playground.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          suspended: false,
        }, // Match the playground by ID and ensure it's not suspended
      },
      {
        $lookup: {
          from: "reviews", // Join with the 'reviews' collection
          localField: "_id",
          foreignField: "playgroundId", // Match reviews with the playground ID
          as: "reviews",
        },
      },
      {
        $unwind: {
          path: "$reviews", // Unwind the reviews array for individual processing
          preserveNullAndEmptyArrays: true, // Include playgrounds without reviews
        },
      },
      {
        $lookup: {
          from: "users", // Join with the 'users' collection
          localField: "reviews.userId",
          foreignField: "_id", // Match user IDs
          as: "reviews.user", // Populate the user field in each review
        },
      },
      {
        $unwind: {
          path: "$reviews.user", // Unwind the user array
          preserveNullAndEmptyArrays: true, // Include reviews without corresponding users
        },
      },
      {
        $group: {
          _id: "$_id", // Regroup playground documents
          playgroundData: { $first: "$$ROOT" }, // Preserve the playground data
          reviews: { $push: "$reviews" }, // Rebuild the reviews array
        },
      },
      {
        $addFields: {
          "playgroundData.reviews": "$reviews", // Assign populated reviews back to the playground data
        },
      },
      {
        $replaceRoot: {
          newRoot: "$playgroundData", // Replace the root document with the updated playground data
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: {
                $divide: [{ $sum: "$reviews.rating" }, { $size: "$reviews" }],
              },
              else: 0,
            },
          },
        },
      },
      { $limit: 1 }, // Ensure only one playground is returned
    ]);

    if (playground.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Playground not found.",
      });
    }

    if (playground.length > 0 && Array.isArray(playground[0].reviews)) {
      // Check if the review field contains a single empty object [{}]
      if (
        playground[0].reviews.length === 1 &&
        typeof playground[0].reviews[0] === "object" &&
        Object.keys(playground[0].reviews[0]).length === 0
      ) {
        playground[0].reviews = []; // Convert to an empty array
      }
    }

    return res.status(200).json({
      status: "success",
      playground: playground[0], // Access the playground from the result
    });
  }
);

export const updatePlayground = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid playground ID.",
      });
    }

    let images = undefined;
    if(req.files.length > 0)
      images = req.files.map((file: any) => file.path);
    
    const playground = await Playground.findById(id);
    if (!playground) {
      return res.status(404).json({
        status: "fail",
        message: "Playground not found.",
      });
    }
    
    // if (req.user.role !== "admin" && req.user._id !== playground.ownerId) {
    //   return res.status(403).json({
    //     status: "fail",
    //     message: "You are not authorized to update this playground.",
    //   });
    // }
    const updatedPlayground = await Playground.findByIdAndUpdate(
      id,
      {
        availableDays: req.body.availableDays? JSON.parse(req.body.availableDays) : playground.availableDays,
        images: images || playground.images,
        name: req.body.name || playground.name,
        description: req.body.description || playground.description,
        size: req.body.size || playground.size,
        price: req.body.price || playground.price,
        address: req.body.address || playground.address,
      },
      {
        new: true,
      }
    );
    console.log(req.body.size)
    return res.status(200).json({
      status: "success",
      message: "Playground updated successfully.",
      playground: updatedPlayground,
    });
  }
);

export const searchPlaygrounds = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { query } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    if (!query) {
      return res.status(400).json({
        status: "fail",
        message: "Query is required.",
      });
    }
    query = query.toString().trim();
    const playgrounds = await Playground.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive search on 'name' field
        { address: { $regex: query, $options: "i" } }, // Case-insensitive search on 'address' field
      ],
      suspended: false,
    });
    const count = playgrounds.length;
    return res.status(200).json({
      status: "success",
      playgrounds,
      meta:{
        page,
        total_results: count,
        per_page:5,
        total_pages:  Math.ceil( count / 5 ) + (count%5 == 0 ? 0 : 1)
      }
    });
  }
);

export const addReview = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const playgroundId = req.params.id;
    // Check if the user is logged in
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "You need to be logged in to add a review.",
      });
    }

    // Get playground and review data from request body
    const { rating, comment } = req.body;

    // Check if the required fields are provided
    if (
      !playgroundId ||
      !mongoose.isValidObjectId(playgroundId) ||
      (!rating && !comment)
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Playground ID, rating, and comment are required.",
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: "fail",
        message: "Rating must be between 1 and 5.",
      });
    }

    // Create the review
    const review = await Review.create({
      playgroundId,
      userId: req.user._id,
      rating,
      comment,
    });

    // Add the review to the playground's reviews array
    const playground = await Playground.findById(playgroundId);
    if (!playground) {
      return res.status(404).json({
        status: "fail",
        message: "Playground not found.",
      });
    }

    playground.reviews.push(review._id as mongoose.Types.ObjectId);
    await playground.save();

    // Return the review
    return res.status(201).json({
      status: "success",
      message: "Review added successfully.",
      review,
    });
  }
);
