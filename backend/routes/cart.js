import express from "express";

import { cartAdd,cartItems,removeCart,removeAllCartItems,decrementCart} from "../controllers/cart.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();

router.post("/cartAdd", isAuthenticated, cartAdd);
router.get("/cartItems", isAuthenticated, cartItems);
router.delete("/removeCart", isAuthenticated, removeCart);
router.delete("/removeCartAll", isAuthenticated, removeAllCartItems);
router.put("/decrementCart", isAuthenticated, decrementCart);

export default router;
