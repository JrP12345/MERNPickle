import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        
      },
      quantity: {
        type: Number,
      
        min: 1
      },
      weight: {
        type: Number,
       
      }
    }
  ],
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  
  },
  paymentMethod: {
    type: String,
    enum: ["netBanking", "cashOnDelivery", "otherUPI"],
   
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderTotal:{
    type: Number,
   
  }
});

export const Order = mongoose.model("Order", orderSchema);
