import mongoose from "mongoose";

const userRegisterSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

export const User = mongoose.model("User", userRegisterSchema);
