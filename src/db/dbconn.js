import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectdb = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log(`\n Mongodb Connected  !! DB Host ${conn.connection.host}`);
  } catch (err) {
    console.log("Mongo Connection Falet ❌", err);
    process.exit(1);
  }
};

export default connectdb;
