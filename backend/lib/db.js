import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
let client = null
let bucket = null
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  }
}

export default connectDB
