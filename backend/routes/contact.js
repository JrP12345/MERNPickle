import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { newMessage} from "../controllers/contact.js";
const router = express.Router();
router.post("/new",isAuthenticated, newMessage);

export default router;
