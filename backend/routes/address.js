import express from "express";

import { addressAdd, addressList} from "../controllers/address.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();

router.post("/add", isAuthenticated, addressAdd);
router.get("/list", isAuthenticated, addressList);

export default router;
