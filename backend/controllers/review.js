import { Review } from "../models/review.js";

export const addReview = async (req, res) => {
    try {
      // Ensure user is authenticated and user ID is available
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      const userId = req.user.id;
      const { review, rating, productId } = req.body;
  
      // Validate the review input
      if (!review) {
        return res.status(400).json({ success: false, message: "Review is required" });
      }
  
      // Validate the rating input
      if (rating === undefined || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
      }
   // Validate the product ID input
   if (!productId) {
    return res.status(400).json({ success: false, message: "Product ID is required" });
  }
      // Create the new review
      const newReview = await Review.create({
        review,
        rating,
        userId,
        productId,
        createdAt: new Date()
      });
  
      // Check if review creation was successful
      if (newReview) {
        return res.status(201).json({ success: true, message: "Review added successfully" });
      } else {
        return res.status(500).json({ success: false, message: "Failed to add review" });
      }
    } catch (error) {
      console.error("Add Review Error:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  
  export const getReviewsByProduct = async (req, res) => {
    try {
      const { productId } = req.params;
  
      // Validate the product ID input
      if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
      }
  
      // Fetch reviews for the specified product
      const reviews = await Review.find({ productId }).populate('userId', 'username');
  
      return res.status(200).json({ success: true, reviews });
    } catch (error) {
      console.error("Get Reviews Error:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  