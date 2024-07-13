
import { User } from "../models/user.js";
import { sendCookie } from "../utilities/sendCookies.js";
import bcrypt from "bcrypt";
export const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      console.log("User Already Exist");
      return res
        .status(400)
        .json({ success: true, message: "User Already Exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      sendCookie(newUser, res, "User Register Succesfully", 201);
    } else {
      // Handle the case where user creation failed
      res
        .status(500)
        .json({ success: false, message: "Failed to register user" });
    }
  } catch (error) {
    console.error("Registration Error:", error);

    // Check if the error is a duplicate key error (E11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("User Not Found");
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }
    sendCookie(user, res, `WelcomeBack ${user.username}`, 200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const userProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      // Log an error message to help with debugging
      console.error("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Send user details to the client
    res.status(200).json({ success: true, user });
  } catch (error) {
    // Log the error to help with debugging
    console.error(error);

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const userLogout = (req, res) => {
  res
    .status(200)
    .cookie("Token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      user: req.user,
    });
};
