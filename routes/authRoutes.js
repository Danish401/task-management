const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,logoutUser
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/logout", logoutUser);
module.exports = router;
