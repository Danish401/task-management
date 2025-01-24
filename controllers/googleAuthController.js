const User = require("../models/User");
const { generateToken } = require("../utils/jwtUtils");

// Google OAuth Login/Register
const googleAuth = async (req, res) => {
  const { googleId, name, email } = req.body;

  try {
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({ googleId, name, email });
    }

    const token = generateToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { googleAuth };
