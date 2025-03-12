import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { AdminEarnings, Earnings } from "../models/earningModel";
import User from "../models/userModel"; // Add this line to import the User model
import Playground from "../models/playgroundModel"; // Add this line to import the Playground model

export const getMonthlyEarnings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ownerId } = req.params;

    // Validate owner ID
    if (!mongoose.isValidObjectId(ownerId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid owner ID provided.",
      });
    }

    // Aggregate monthly earnings for the given owner
    const monthlyEarnings = await Earnings.aggregate([
      {
        $match: {
          ownerId: new mongoose.Types.ObjectId(ownerId), // Match earnings by owner ID
        },
      },
      {
        $group: {
          _id: "$month", // Group by month (format: "MM-YYYY")
          totalEarnings: { $sum: "$totalEarnings" }, // Sum up total earnings for the month
          unpaidAmount: {
            $sum: {
              $cond: [{ $eq: ["$paid", false] }, "$requiredAmount", 0], // Sum unpaid amounts
            },
          },
        },
      },
      {
        $sort: {
          _id: 1, // Sort by month in ascending order
        },
      },
    ]);

    // Format the results for better readability
    const formattedEarnings = monthlyEarnings.map((entry) => ({
      month: entry._id, // Pre-calculated month
      totalEarnings: parseFloat(entry.totalEarnings.toFixed(2)), // Format total earnings
      unpaidAmount: parseFloat(entry.unpaidAmount.toFixed(2)), // Format unpaid amount
    }));

    // Return success response
    return res.status(200).json({
      status: "success",
      earnings: formattedEarnings,
    });
  }
);

export const getUnpaidEarnings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Fetch all owners
    const owners = await User.find({ role: "owner" }).select("name playgrounds");

    // Map to fetch playgrounds and earnings for each owner
    const data = await Promise.all(
      owners.map(async (owner) => {
        // Fetch playgrounds owned by the user
        const playgrounds = await Playground.find({
          ownerId: owner._id,
        }).select("name suspended");

        // Calculate total commission
        const totalCommission = await Earnings.aggregate([
          { $match: { ownerId: owner._id , paid:false} },
          {
            $group: {
              _id: null,
              totalCommission: { $sum: "$requiredAmount" },
            },
          },
        ]);

        return {
          ownerId: owner._id,
          ownerName: owner.name,
          playgrounds: playgrounds,
          totalCommission:
            totalCommission.length > 0
              ? totalCommission[0].totalCommission
              : 0,
        };
      })
    );

    res.status(200).json({ success: true, data });
  }
);

export const markEarningsAsPaid = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ownerId } = req.body;

    // Validate owner ID
    if (!mongoose.isValidObjectId(ownerId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid owner ID provided.",
      });
    }

    // Update the earnings for the given owner and month
    const result = await Earnings.updateMany(
      {
        ownerId: new mongoose.Types.ObjectId(ownerId), // Match earnings by owner ID
        paid: false, // Only unpaid earnings
      },
      {
        $set: {
          paid: true, // Mark earnings as paid
          requiredAmount: 0, // Reset the required amount to 0
        },
      }
    );

    // Return success response
    return res.status(200).json({
      status: "success",
      message: `${result.modifiedCount} earnings marked as paid }.`,
    });
  }
);
