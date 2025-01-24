const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "danisha563",
  api_key: "415143765897583",
  api_secret: "UHPTMAvNVUt3UMbUcYlHTcVoatk",
});

console.log({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
