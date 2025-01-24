const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true },
    photo: { type: String, required: true }, // URL of the photo from Cloudinary
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
