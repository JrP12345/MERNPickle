import { Product } from "../models/product.js";
import multer from "multer";
import fs from "fs";

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "productsimg/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage: storage });
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      ingredients,
      manufacturingDate,
      expiryDate,
      countryOrigin,
      pickleType,
      pickleMethod,
      spiceLevel,
      culturalVarieties,
      weight,
    } = req.body;
    // Check if a file is uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a file" });
    }

    // Access the uploaded file path and replace backslashes with forward slashes
    const profilePicture = req.file.path.replace(/\\/g, "/");

    // Check if the product already exists
    let existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      console.log("Product already exists");
      return res
        .status(400)
        .json({ success: false, message: "Product already exists" });
    }

    // Create the new product
    const newProduct = await Product.create({
      name,
      description,
      price,
      quantity,
      ingredients,
      image: profilePicture,
      manufacturingDate,
      expiryDate,
      countryOrigin,
      pickleType,
      pickleMethod,
      spiceLevel,
      culturalVarieties,
      weight,
    });

    if (newProduct) {
      return res
        .status(201)
        .json({ success: true, message: "Product added successfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to add product" });
    }
  } catch (error) {
    console.error("Add Product Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const productList = async (req, res) => {
  try {
    // Fetch all players
    const product = await Product.find();
    res.json({ success: true, data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const productDetail = async (req, res) => {
  try {
    const productId = req.params.id; // Extract productId from URL params
    const product = await Product.findById(productId);
    if (!product) {
      console.error("Product not found. Product ID:", productId);
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
