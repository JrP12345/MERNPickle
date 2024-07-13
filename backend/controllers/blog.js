import { Blog } from "../models/blog.js";
import multer from "multer";
import fs from 'fs'; 

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
export const addBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      author,
      category,
      blogdate 
    } = req.body;
 // Check if a file is uploaded

 if (!req.file) {
  return res.status(400).json({ success: false, message: "Please upload a file" });
}

// Access the uploaded file path and replace backslashes with forward slashes
const blogPicture = req.file.path.replace(/\\/g, '/');
    // Check if the product already exists
    let existingBlog = await Blog.findOne({ title });

    if (existingBlog) {
      console.log("Blog already exists");
      return res
        .status(400)
        .json({ success: false, message: "Blog already exists" });
    }

    // Create the new product
    const newBlog = await Blog.create({
        title,
        description,
        author,
        category,
        image:blogPicture,
        blogdate
    });

    if (newBlog) {
      return res
        .status(201)
        .json({ success: true, message: "Blog added successfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to add Blog" });
    }
  } catch (error) {
    console.error("Add Blog Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const blogList = async (req, res) => {
    try {
      // Fetch all blog
      const blog = await Blog.find();
      res.json({ success: true, data: blog });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
  
  export const blogDetail = async (req, res) => {
      try {
          const blogId = req.params.id; // Extract productId from URL params
          const blog = await Blog.findById(blogId);
          if (!blog) {
              console.error("Blog not found. Blog ID:", blogId);
              return res.status(404).json({ success: false, message: "blog not found" });
          }
    
          res.status(200).json({ success: true, blog });
      } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: "Internal Server Error" });
      }
  };
  