import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  ingredients: String,
  image: { type: String },
  manufacturingDate: Date,
  expiryDate: Date,
  countryOrigin: String,
  pickleType: String,
  pickleMethod: String,
  spiceLevel: String,
  culturalVarieties: String,
  weight: { type: Number, required: true }
});

export const Product = mongoose.model("Product", productSchema);
