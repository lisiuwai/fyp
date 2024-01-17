import mongoose from "mongoose";
import ENV from '../config.env'

export default async function connect(){
    if (mongoose.connection.readyState !== 1) {
        try {
            const db = await mongoose.connect(ENV.ATALAS_URL);
            console.log('MongoDB connected successfully');
        } catch (error) {
            console.error('MongoDB connection failed:', error.message);
        }
    }
}
