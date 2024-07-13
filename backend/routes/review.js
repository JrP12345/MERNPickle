import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { addReview,getReviewsByProduct} from "../controllers/review.js";
const router = express.Router();
router.post("/add", isAuthenticated,addReview);
router.get("/list/:productId",isAuthenticated,getReviewsByProduct);
// router.get("/:id", reviewDetail);
export default router;
