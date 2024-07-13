import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    userId :String,
    message :String
})

export const Contact = mongoose.model("Contact", contactSchema);