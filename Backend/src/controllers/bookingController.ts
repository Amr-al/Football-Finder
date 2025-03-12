import { Request, Response, NextFunction } from "express";
import Booking from "../models/bookingModel";
import Playground from "../models/playgroundModel";
import catchAsync from "../utils/catchAsync";
import mongoose from "mongoose";
import { format, parse, startOfMonth } from "date-fns"; // date-fns for date manipulation
import { Earnings } from "../models/earningModel";
import { arabicToEnglishDays } from "../utils/helpers";

export const bookPlayground = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const playgroundId = req.params.id;
    const { date, times } = req.body;
    const userId = req.user?._id; // Get the user ID from the authenticated user
    if (
      !playgroundId ||
      !mongoose.isValidObjectId(playgroundId) ||
      !date ||
      !times ||
      !Array.isArray(times) ||
      times.length === 0
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Playground ID, date, and an array of times are required.",
      });
    }

    // Check if playground exists
    const playground = await Playground.findById(playgroundId);
    if (!playground) {
      return res.status(404).json({
        status: "fail",
        message: "Playground not found.",
      });
    }
    const [day, month, year] = date.split("-").map(Number); // Split and convert to numbers

    // Check if the selected date is available for the playground
    const availableDayNames = playground.availableDays.map(
      (day: { date: string; times: string[] }) => {
        const dayName = arabicToEnglishDays(day.date);
        return dayName ? dayName.toLowerCase() : "";
      }
    );
    const selectedDate = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date

    const dayOfWeek = selectedDate
      .toLocaleString("en-us", { weekday: "long" })
      .toLowerCase(); // Get the weekday name (e.g., "Sunday", "Monday")

    if (!availableDayNames.includes(dayOfWeek)) {
      return res.status(400).json({
        status: "fail",
        message: `لا يوجد مواعيد متاحة في هذا اليوم.`,
      });
    }

    // Check if the selected times are available for the chosen date
    const availableDate = playground.availableDays.find(
      (item: { date: string }) => arabicToEnglishDays(item.date) === dayOfWeek
    );
  
    if (!availableDate) {
      return res.status(400).json({
        status: "fail",
        message: `The selected date is not available.`,
      });
    }

    // Check if all selected times are available for the chosen date
    const unavailableTimes = times.filter(
      (time) => !availableDate.times.includes(time)
    );

    if (unavailableTimes.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: `The following times are not available: ${unavailableTimes.join(
          ", "
        )}`,
      });
    }

    // Check if the user already has a booking for this date and time
    const existingBookings = await Booking.find({ date, time: { $in: times } });
    if (existingBookings.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: "Not available. The selected time is already booked",
      });
    }

    // Create bookings for each selected time
    const bookings = [];
    for (const time of times) {
      const booking = await Booking.create({
        playgroundId,
        date,
        time,
        price: playground.price,
        userId,
      });
      bookings.push(booking);
    }

    return res.status(201).json({
      status: "success",
      message: "Bookings created successfully.",
      bookings,
    });
  }
);

export const updateBookingStatus = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { bookingId, status } = req.body;
    console.log(req.body)

    const userId = req.user?._id;
    if (!bookingId || !status || !mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({
        status: "fail",
        message: "Booking ID and status are required.",
      });
    }
    const booking: any = await Booking.findById(bookingId).populate(
      "playgroundId"
    );
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found.",
      });
    }

    // if (booking.playground.ownerId != userId) {
    //   return res.status(403).json({
    //     status: "fail",
    //     message: "You are not authorized to update this booking.",
    //   });
    // }

    const Earing = await Earnings.findOne({
      playgroundId: booking.playgroundId._id,
      month: `${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
    });
    if (Earing) {
      if (status === "تم التأكيد" && booking.status !== "تم التأكيد") {
        Earing.totalEarnings += parseInt(booking.playgroundId.price);
        Earing.requiredAmount += parseInt(booking.playgroundId.price) * 0.05;
        await Earing.save();
      } else if (status !== "تم التأكيد" && booking.status === "تم التأكيد") {
        Earing.totalEarnings -= parseInt(booking.playgroundId.price);
        Earing.requiredAmount -= parseInt(booking.playgroundId.price) * 0.05;
        await Earing.save();
      }
    } else {
      await Earnings.create({
        playgroundId: booking.playgroundId._id,
        ownerId: booking.playgroundId.ownerId,
        month: `${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
        totalEarnings:
          status === "تم التأكيد" ? parseInt(booking.playgroundId.price) : 0,
        requiredAmount:
          status === "تم التأكيد"
            ? parseInt(booking.playgroundId.price) * 0.05
            : 0,
      });
    }
    booking.status = status;
    await booking.save();
    return res.status(200).json({
      status: "success",
      message: "Booking status updated successfully.",
      booking,
    });
  }
);

export const getUserBookings = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        status: "fail",
        message: "You need to be logged in to get bookings.",
      });
    }
    const bookings = await Booking.find({ userId })
      .populate({
        path: "playgroundId",
        populate: {
          path: "ownerId", // Populate the owner of the playground
          select: "name phone", // Only select specific fields for the owner
        },
      })
      .limit(10)
      .skip((page - 1) * 10)
      .sort({ createdAt: -1 });
    return res.status(200).json({
      status: "success",
      bookings,
    });
  }
);

export const getOwnerBookingsAndEarnings = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const ownerId = req.user._id;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;

    // Validate owner ID
    if (!mongoose.isValidObjectId(ownerId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid owner ID.",
      });
    }

    // Get the current date and start of the current month
    const startOfCurrentMonth = startOfMonth(new Date());

    const playgrounds = await Playground.find({ ownerId });

    // Aggregate bookings and earnings for the current month in parallel
    const [bookings, earnings] = await Promise.all([
      // Fetch bookings for the owner
      Booking.find({
        playgroundId: { $in: playgrounds.map((playground) => playground._id) }, // Match any playground owned by the owner
      })
        .populate("playgroundId") // Populate the playground details
        .populate("userId") // Populate the user details
        .limit(10)
        .skip((page - 1) * 10)
        .sort({ createdAt: -1 }), // Sort by createdAt, descending
      // Calculate earnings for the current month
      Booking.aggregate([
        {
          $lookup: {
            from: "playgrounds", // The collection name for playgrounds
            localField: "playgroundId",
            foreignField: "_id",
            as: "playground",
          },
        },
        {
          $unwind: "$playground", // Flatten the playground array
        },
        {
          $match: {
            "playground.ownerId": new mongoose.Types.ObjectId(ownerId), // Match playgrounds owned by the owner
            status: "تم التأكيد", // Only confirmed bookings
            createdAt: {
              $gte: startOfCurrentMonth, // Filter for the current month
            },
          },
        },
        {
          $group: {
            _id: null, // We don't need to group by date, just aggregate earnings
            totalEarnings: { $sum: "$playground.price" }, // Sum the price from the playground schema
            bookingsCount: { $sum: 1 }, // Count the number of bookings
          },
        },
      ]),
    ]);

    // If no earnings, return 0 earnings and bookings count
    const earningsResult =
      earnings.length > 0
        ? earnings[0]
        : { totalEarnings: 0, bookingsCount: 0 };

    // Return both bookings and earnings in the response
    return res.status(200).json({
      status: "success",
      bookings,
      meta: {
        page,
        totalEarnings: earningsResult.totalEarnings.toFixed(2),
        totalCommission: earningsResult.totalEarnings * 0.05,
        bookingsCount: earningsResult.bookingsCount,
      },
    });
  }
);

export const getAvailableTimes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playgroundId, date } = req.params;

    // Validate playground ID
    if (!mongoose.isValidObjectId(playgroundId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid playground ID.",
      });
    }

    // Fetch playground and filter available times based on the weekday
    const playground = await Playground.findById(playgroundId).select(
      "availableDays"
    );

    if (!playground) {
      return res.status(404).json({
        status: "fail",
        message: "Playground not found.",
      });
    }

    const [day, month, year] = date.split("-").map(Number); // Split and convert to numbers

    // Check if the selected date is available for the playground
    const availableDayNames = playground.availableDays.map(
      (day: { date: string; times: string[] }) => day.date.toLowerCase()
    );
    const selectedDate = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date

    const dayOfWeek = selectedDate
      .toLocaleString("en-us", { weekday: "long" })
      .toLowerCase(); // Get the weekday name (e.g., "Sunday", "Monday")


    // Check if the selected times are available for the chosen date
    const availableDate = playground.availableDays.find(
      (item: { date: string }) => arabicToEnglishDays(item.date) === dayOfWeek
    );
    if (!availableDate) {
      return res.status(400).json({
        status: "fail",
        message: `لا يوجد مةاعيد متاحة`,
      });
    }


    // Fetch existing bookings for the given date and playground
    const bookedTimes = await Booking.find({
      playgroundId,
      date,
      status: { $in: ["تم التأكيد", "قيد الانتظار"] }, // Exclude cancelled bookings
    }).select("time");

    console.log(bookedTimes)

    const bookedTimeSet = new Set(bookedTimes.map((booking) => booking.time));

    // Filter out already booked times
    const availableTimes = availableDate.times.filter(
      (time) => !bookedTimeSet.has(time)
    );

    return res.status(200).json({
      status: "success",
      availableTimes,
    });
  }
);
