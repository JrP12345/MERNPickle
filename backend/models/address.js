import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId:String,
    name :String,
    mobile:Number,
    pincode:Number,
    locality:String,
    address:String,
    city:String,
    state:String
})

export const Adrress = mongoose.model("Adrress", addressSchema);