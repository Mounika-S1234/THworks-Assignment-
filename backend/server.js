const express = require("express");
const cors = require("cors");
const { db } = require("./src/db/database");
const tasksRouter = require("./src/routes/tasks.router");
const { getInsights } = require("./src/services/insight.service");

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.use("/tasks", tasksRouter);

// Insights Endpoint
app.get("/insights", (req, res) => {
  try {
    const insights = getInsights();
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
