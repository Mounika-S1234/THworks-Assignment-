const { db } = require("../db/database");

function getAllTasks({ status, priority, sortBy }) {
  let query = "SELECT * FROM tasks WHERE 1=1";
  const params = [];

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }
  if (priority) {
    query += " AND priority = ?";
    params.push(priority);
  }
  if (sortBy === "due_date") query += " ORDER BY due_date ASC";

  return db.prepare(query).all(params);
}

function createTask(task) {
  const { title, description, priority, due_date } = task;
  const stmt = db.prepare(
    "INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)"
  );
  const info = stmt.run(title, description, priority, due_date);
  return { id: info.lastInsertRowid, ...task, status: "Open" };
}

function updateTask(id, updates) {
  const { status, priority } = updates;
  const stmt = db.prepare(
    "UPDATE tasks SET status = COALESCE(?, status), priority = COALESCE(?, priority) WHERE id = ?"
  );
  stmt.run(status, priority, id);
  return db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
}

function deleteTask(id) {
  const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
