import { Adrress } from "../models/address.js";

export const addressAdd = async (req, res) => {
  try {
    // Ensure user is authenticated and user ID is available
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { name, mobile, pincode, locality, address, city, state } = req.body;

    // Validate the message input
    if (!name, !mobile, !pincode, !locality, !address, !city, !state) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    // Create the new message
    const newAddress = await Adrress.create({
      userId,
      name,
      mobile,
      pincode,
      locality,
      address,
      city,
      state,
    });

    // Check if message creation was successful
    if (newAddress) {
      return res
        .status(201)
        .json({ success: true, message: "Address added successfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to add Address" });
    }
  } catch (error) {
    console.error("Add Address Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const addressList = async (req, res) => {
    try {
        // Ensure user is authenticated and user ID is available
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      const userId = req.user.id;

      const address = await Adrress.find({ userId });
      res.json({ success: true, data: address });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };