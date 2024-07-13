import express from "express";

import { addBlog,blogList,blogDetail} from "../controllers/blog.js";
const router = express.Router();
router.post("/addblog", addBlog);
router.get("/list",blogList);
router.get("/:id", blogDetail);
export default router;
