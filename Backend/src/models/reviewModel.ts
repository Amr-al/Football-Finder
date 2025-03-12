import mongoose, { Document, Schema, Types } from "mongoose";

// Review schema to store reviews for a playground
interface IReview extends Document {
  playgroundId: Types.ObjectId; // Reference to the playground being reviewed
  userId: Types.ObjectId; // Reference to the user who left the review
  rating: number; // Rating (1 to 5)
  comment: string; // Review comment
  createdAt: Date; // Review creation date
}

// Review Schema
const reviewSchema = new Schema<IReview>(
  {
    playgroundId: {
      type: Schema.Types.ObjectId,
      ref: "Playground", // Reference to the playground being reviewed
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the user who left the review
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;