// config/db.js
import mongoose from 'mongoose'
import { COLLECTOIN_NAME } from '../constants.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL+COLLECTOIN_NAME);
    console.log(`MongoDB Connected: successfully`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1); // Exit process with failure
  }
};


export default connectDB;
