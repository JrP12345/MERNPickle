import userRouter from "./routes/user.js"
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.js"
import cartRouter from "./routes/cart.js"
import contactRouter from "./routes/contact.js"
import reviewRouter from "./routes/review.js"
import addressRouter from "./routes/address.js"
import orderRouter from "./routes/order.js"

import { fileURLToPath } from 'url';
import path from "path";
import multer from "multer"; // Import multer
dotenv.config();

export const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({ origin: true, credentials: true })); // Allow requests from all origins
app.use(express.json())
app.use(cookieParser(process.env.SECRET_CODE,{
    sameSite:"none",
    secure:true
}))
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'productsimg/') // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // Unique filename
    }
});
const upload = multer({ storage: storage });

// Middleware to handle file uploads
app.use(upload.single('image'));

// Serve uploaded files statically
app.use('/productsimg', express.static(path.join(__dirname, 'productsimg')));

app.use("/product",productRouter)
app.use("/user",userRouter)
app.use("/cart",cartRouter)
app.use("/contact",contactRouter)
app.use("/review",reviewRouter)
app.use("/address",addressRouter)
app.use("/order",orderRouter)
