import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
const mongoURI: any = process.env.MONGO_URI;
const mongoLocalURI: any = process.env.MONGO_LOCAL_URI;

const connectDB = async () => {
  try {
    //connect mongodb atlas
    await mongoose.connect("mongodb://localhost:27017/test", {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
