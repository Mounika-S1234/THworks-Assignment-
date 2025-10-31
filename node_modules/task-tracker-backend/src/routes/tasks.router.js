const express = require("express");
const router = express.Router();
const { getAllTasks, createTask, updateTask, deleteTask } = require("../services/task.service");

router.get("/", (req, res) => {
  try {
    const tasks = getAllTasks(req.query);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.post("/", (req, res) => {
  try {
    const task = createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: "Invalid task data" });
  }
});

router.patch("/:id", (req, res) => {
  try {
    const updated = updateTask(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update task" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const deleted = deleteTask(req.params.id);
    if (deleted) {
      res.status(200).json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
