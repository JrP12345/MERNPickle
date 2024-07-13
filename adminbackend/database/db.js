import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Admin Database Is Connected To Mongo Atlas");
  } catch (error) {
    console.log(error);
  }
};
