const express = require("express");
const passport = require("passport");
const router = express.Router();

const { generateToken } = require("../utils/jwtUtils");

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login/failed" }),
  (req, res) => {
    const userData = {
      user: req.user,
      token: generateToken(req.user._id),
    };
const CLIENT_URL = process.env.CLIENT_URL || "https://taskmanagerda.netlify.app";
    const script = `
      <script>
        window.opener.postMessage(${JSON.stringify(userData)}, "${CLIENT_URL}");
        window.close();
      </script>
    `;

    res.send(script);
  }
);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));


router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: true, message: "Logout failed" });
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = router;
