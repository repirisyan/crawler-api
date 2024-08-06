import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`; // Replace 'mydatabase' with your actual database name

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process on connection error
  }
};

export { connectDB, mongoose };
