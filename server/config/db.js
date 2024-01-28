// server/config/db.js
// /Users/yrdnqldrwn/Desktop/SOFTWARE/VS_Code/proshop/server/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected to:" + connect.connection.name);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
