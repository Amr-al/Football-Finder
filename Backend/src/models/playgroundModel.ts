import mongoose, { Document, Schema, Types } from "mongoose";

// Playground schema
interface IPlayground extends Document {
  name: string;
  address: string;
  images: string[];
  availableDays: { date: string; times: string[] }[]; // Array of available dates and times
  ownerId: Types.ObjectId; // Reference to the owner of the playground
  size: string; // size of the playground
  price: number; // price of the playground per hour
  description?: string; // description of the playground
  reviews: Types.ObjectId[]; // Array of review references
  suspended: boolean; // Flag to suspend a playground temporarily
}




// Playground Schema
const playgroundSchema = new Schema<IPlayground>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    availableDays: [
      {
        date: {
          type: String,
          required: true,
        },
        times: {
          type: [String],
          required: true,
        },
      },
    ],
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    suspended: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster querying
playgroundSchema.index({ ownerId: 1 });

// Create the models
const Playground = mongoose.model<IPlayground>("Playground", playgroundSchema);

export default Playground ;
