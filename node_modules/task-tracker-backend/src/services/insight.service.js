const { db } = require("../db/database");

function getInsights() {
  const totalOpen = db
    .prepare("SELECT COUNT(*) as count FROM tasks WHERE status='Open'")
    .get().count;

  const priorities = db
    .prepare("SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority")
    .all();

  const dueSoon = db
    .prepare(
      `SELECT COUNT(*) as count FROM tasks 
       WHERE DATE(due_date) <= DATE('now', '+3 day') AND status != 'Done'`
    )
    .get().count;

  const summary = generateSummary(totalOpen, priorities, dueSoon);

  return { totalOpen, priorities, dueSoon, summary };
}

function generateSummary(totalOpen, priorities, dueSoon) {
  const total = priorities.reduce((sum, p) => sum + p.count, 0);
  const high = priorities.find((p) => p.priority === "High")?.count || 0;
  let dominantPriority = "Medium";
  if (high / total > 0.5) dominantPriority = "High";

  let summary = `You have ${totalOpen} open tasks.`;
  if (dueSoon > 0) summary += ` ${dueSoon} are due in the next 3 days.`;
  summary += ` Most of your tasks are ${dominantPriority} priority.`;

  return summary;
}

module.exports = { getInsights };
