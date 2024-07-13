import express from "express";

import { userLogin, userRegister, userProfile,userLogout } from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/userprofile", isAuthenticated, userProfile);
router.delete("/logout", userLogout);
export default router;
