


const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware"); // Correct import
// Routes
router.get("/", taskController.getAllTasks);
router.get("/user/:userId",protect, taskController.getTasksByUserId);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/data/:id", taskController.updateTaskDetails);
router.patch("/data/:id/status", taskController.updateTaskStatus);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
