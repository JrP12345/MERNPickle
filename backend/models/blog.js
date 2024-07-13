import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title:{type:String,required:true},
    author:{type:String,required:true},
    blogdate:Date,
    image:{type:String},
    description:{type:String,required:true},
    category:{type:String}
})

export const Blog = mongoose.model("Blog", blogSchema);