import { Contact } from "../models/contact.js";

export const newMessage = async (req, res) => {
    try {
      // Ensure user is authenticated and user ID is available
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      const userId = req.user.id;
      const { message } = req.body;
  
      // Validate the message input
      if (!message) {
        return res.status(400).json({ success: false, message: "Message is required" });
      }
  
      // Create the new message
      const newMessage = await Contact.create({
        message,
        userId
      });
  
      // Check if message creation was successful
      if (newMessage) {
        return res.status(201).json({ success: true, message: "Message added successfully" });
      } else {
        return res.status(500).json({ success: false, message: "Failed to add message" });
      }
    } catch (error) {
      console.error("Add Message Error:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
