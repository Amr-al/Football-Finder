import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const DBconnection = async () => {
  try {
    mongoose
      .connect(process.env.DB_URL!, { appName: "FootBall-Finder" })
      .then(() => {
        console.log("database Connected");
      })
      .catch((error: any) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
  }
};
