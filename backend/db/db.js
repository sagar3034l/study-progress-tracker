import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

export async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongdb connected for the host", conn.connection.host)
    } catch (error) {
        console.log('Error in Database connection',error);
        process.exit(1);
    }
}