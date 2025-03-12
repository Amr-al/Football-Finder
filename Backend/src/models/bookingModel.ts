import mongoose, { Document, Schema, Types } from "mongoose";

// Booking schema to store individual bookings
interface IBooking extends Document {
  playgroundId: Types.ObjectId; // Reference to the playground
  date: string; // format: "Sunday ...", "Monday ...", etc.
  time: string; // Format: "HH:mm AM/PM"
  userId: Types.ObjectId; // Reference to the user who made the booking
  price: number; // Payment amount
  status: "تم التأكيد" | "قيد الانتظار" | "ملغي"; // Booking status
}

// Booking Schema
const bookingSchema = new Schema<IBooking>(
  {
    playgroundId: {
      type: Schema.Types.ObjectId,
      ref: "Playground",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
      type: String,
      enum: ["تم التأكيد", "قيد الانتظار", "ملغى"],
      default: "قيد الانتظار",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
