import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000";

const TaskList = ({ tasks, onTasksUpdated }) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.delete(`${BACKEND_URL}/tasks/${taskId}`);
      if (response.status === 200) {
        onTasksUpdated(); // re-fetch tasks after delete
        alert("Task deleted successfully!");
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      if (error.response) {
        alert(`Failed to delete task: ${error.response.data.error || 'Server error'}`);
      } else if (error.request) {
        alert("Could not reach the server. Please check if the backend is running.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    setLoading(true);
    try {
      await axios.patch(`${BACKEND_URL}/tasks/${taskId}`, {
        status: newStatus,
      });
      onTasksUpdated(); // re-fetch tasks after update
      alert("Task marked as complete!");
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-list">
      <h2>Tasks</h2>
      <div className="tasks-container">
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-item">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-details">
                <p>Priority: {task.priority}</p>
                <p>Status: {task.status}</p>
                <p>
                  Due Date:{" "}
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString()
                    : "No date"}
                </p>
              </div>
              <div className="task-actions">
                <button
                  onClick={() => handleUpdateStatus(task.id, "Done")}
                  disabled={task.status === "Done" || loading}
                  style={{
                    backgroundColor: task.status === "Done" ? "#4CAF50" : "#2196F3",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    marginRight: "8px",
                    cursor: task.status === "Done" ? "default" : "pointer"
                  }}
                >
                  {task.status === "Done" ? "✓ Completed" : "Mark Complete"}
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={loading}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
