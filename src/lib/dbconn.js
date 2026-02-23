import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected :${conn.connection.host}`);
    
  } catch (error) {
    console.log("MongoDB Connection Failed ❌",error);
    process.exit(1); // 1 refers to Faliour
  }
};
