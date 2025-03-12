import mongoose, { Document, Schema, Types } from "mongoose";

// earning schema to store individual earnings
interface IEarnings extends Document {
  playgroundId: Types.ObjectId; // Reference to the playground
  ownerId: Types.ObjectId; // Reference to the owner of the playground
  requiredAmount: number; // Required amount to be paid
  paid: boolean;
  totalEarnings: number; // Payment amount
  month: string; // Format: "MM-YYYY"
}

// earning schema to store individual earnings
interface IEarningsForAdmin extends Document {
  totalEarnings: number; // Total earnings
  month: string; // Format: "MM-YYYY"
}

// earning schema
const earningForAdminSchema = new Schema<IEarningsForAdmin>(
  {
    totalEarnings: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// earings Schema
const earningSchema = new Schema<IEarnings>(
  {
    playgroundId: {
      type: Schema.Types.ObjectId,
      ref: "Playground",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    requiredAmount: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Earnings = mongoose.model<IEarnings>("Earnings", earningSchema);
const AdminEarnings = mongoose.model<IEarningsForAdmin>(
  "AdminEarnings",
  earningForAdminSchema
);

export { Earnings, AdminEarnings };
