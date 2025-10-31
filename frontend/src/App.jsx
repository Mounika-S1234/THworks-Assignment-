import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import InsightsPanel from "./components/InsightsPanel";

const BACKEND_URL = "http://localhost:3000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [insights, setInsights] = useState(null);

  // ✅ Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ✅ Fetch insights from backend
  const fetchInsights = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/insights`);
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  };

  // ✅ Load tasks and insights on page load
  useEffect(() => {
    fetchTasks();
    fetchInsights();
  }, []);

  // ✅ Refresh both lists when tasks are updated
  const handleTasksUpdated = async () => {
    await fetchTasks();
    await fetchInsights();
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>📝 Task Tracker</h1>

      {/* Task creation form */}
      <TaskForm onTaskCreated={handleTasksUpdated} />

      {/* Task list with mark/delete buttons */}
      <TaskList tasks={tasks} onTasksUpdated={handleTasksUpdated} />

      {/* Smart insights panel */}
      <InsightsPanel insights={insights} />
    </div>
  );
}
