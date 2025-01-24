const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, },
  description: { type: String,},
  status: { type: String, enum: ["Pending", "Completed", "Done"], default: "Pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
},{ timestamps: true });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
