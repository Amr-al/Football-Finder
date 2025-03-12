import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

// User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  OTP?: string;
  role: "admin" | "user" | "owner";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  playgrounds: [string];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User Schema
const UserSchema: Schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "من فضلك ادخل الاسم"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "من فضلك ادخل الايميل"],
      unique: [true, "الايميل مستخدم من قبل"],
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        "من فضلك ادخل ايميل صحيح",
      ],
    },
    password: {
      type: String,
      required: [true, "من فضلك ادخل كلمة المرور"],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "owner"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    OTP: {
      type: String,
    },
    playgrounds: [String],
  },
  { timestamps: true }
);

// Pre-save Hook for Password Hashing
UserSchema.pre("save", async function (next) {
  const user = this as unknown as IUser;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Method to Compare Passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
