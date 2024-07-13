import express from "express";

import { addProduct, productList,productDetail} from "../controllers/product.js";
const router = express.Router();
router.post("/addproduct", addProduct);
router.get("/list",productList);
router.get("/:id", productDetail);
export default router;
