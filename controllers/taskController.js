const Task = require("../models/taskModel");

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("user", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Get tasks by user ID
exports.getTasksByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ user: userId });
    
    res.status(200).json(tasks||[]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks by user ID" });
  }
};

// Get a task by ID
exports.getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate("user", "name email");
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task by ID" });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  const { name, description } = req.body;
  const user = req.body.user || null; // Make user field optional

  if (!name || !description) {
    return res.status(400).json({ error: "Task name and description are required" });
  }

  try {
    const newTask = new Task({ name, description, user });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Update task details by ID
exports.updateTaskDetails = async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: { name, description, status } },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task details" });
  }
};

// Update task status by ID
exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Pending", "Completed", "Done"].includes(status)) {
    return res.status(400).json({ error: "Invalid task status" });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task status" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};
