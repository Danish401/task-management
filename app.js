const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const authRoute = require("./routes/auth"); // Google Auth routes
const taskRoutes = require("./routes/taskRoutes");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middlewares/errorHandler");

// Initialize database connection
connectDB();

const app = express();

// Middleware: Body parser
app.use(bodyParser.json());

// Middleware: CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://taskmanagerda.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

// Middleware: Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Initialize Passport
require("./passport"); // Import passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoute); // Google Auth routes
app.use("/api/tasks", taskRoutes); // Task routes
app.use("/api/posts", postRoutes); // Post routes
app.use("/api/auth", authRoutes);
// Error handling middleware
app.use(errorHandler);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});
// Export the app for server startup
module.exports = app;
