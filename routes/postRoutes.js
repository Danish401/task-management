const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createPost,
  getPosts,
  deletePost,
  getPostsByUserId,
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware"); // Correct import

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Set file upload destination
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate unique file name
  },
});

const upload = multer({ storage }); // Set multer to use diskStorage

const router = express.Router();

// Routes
router
  .route("/")
  .get(getPosts) // Get all posts
  .post(upload.single("photo"), protect, createPost); // Create post with file upload
router.delete("/:id", deletePost);
router.get("/:userId", getPostsByUserId);

module.exports = router;
