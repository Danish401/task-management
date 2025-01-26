const Post = require("../models/postModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
exports.createPost = async (req, res) => {
  try {
    // Extract the token and verify it
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Get user ID from the token

    const { caption } = req.body;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "posts", // Optional: specify a folder in Cloudinary
      resource_type: "image", // Specify the type of upload
    });

    // After successful upload, delete the local file to save storage
    fs.unlinkSync(req.file.path);

    // Create a new post with the Cloudinary URL
    const newPost = new Post({
      caption,
      photo: result.secure_url, // Use Cloudinary's secure URL
      user: userId,
    });

    // Save the post to the database
    const savedPost = await newPost.save();

    // Respond with the saved post
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.deletePost = async (req, res) => {
  const { id } = req.params; // Extract post ID from request parameters

  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};





exports.getPostsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      throw new Error("User ID is missing in request parameters");
    }

    console.log("UserID: ", userId);

    const posts = await Post.find({ user: new mongoose.Types.ObjectId(userId) });
    console.log("Posts: ", posts);

  

    res.status(200).json(posts ||[]);
  } catch (error) {
    console.error("Error fetching posts by user ID: ", error.message);
    res.status(500).json({ error: "Failed to fetch posts by user ID" });
  }
};



// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name email");
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
