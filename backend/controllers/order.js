import { Order } from "../models/order.js";

export const createOrder = async (req, res) => {
  try {
    // Ensure user is authenticated and user ID is available
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { products, addressId, paymentMethod, orderTotal } = req.body;

    // Validate the input
    if (!products || products.length === 0 || !addressId || !paymentMethod) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate products array
    for (let product of products) {
      if (!product.productId || !product.quantity || !product.weight) {
        return res.status(400).json({ success: false, message: "Product details are required" });
      }
    }

    // Create the new order
    const newOrder = await Order.create({
      userId,
      products,
      addressId,
      paymentMethod,
      orderTotal,
    });

    // Check if order creation was successful
    if (newOrder) {
      return res.status(201).json({ success: true, message: "Order created successfully", data: newOrder });
    } else {
      return res.status(500).json({ success: false, message: "Failed to create order" });
    }
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
