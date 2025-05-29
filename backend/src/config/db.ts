import mongoose from "mongoose";
import { ENV } from "./environments";

const connectDB = async () => {
  try {
    if (!ENV.MONGODB_URI) {
      console.log("MongoDB URI is undefined. Please check your environment variables.");
    }

    await mongoose.connect(ENV.MONGODB_URI);
    console.log(`Connected to MongoDB`);
  } catch (error) {
    console.log(`Connection failed`);
    process.exit(1);
  }
};

export default connectDB;
