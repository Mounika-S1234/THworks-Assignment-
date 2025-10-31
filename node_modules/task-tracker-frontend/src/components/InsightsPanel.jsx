import React from "react";

export default function InsightsPanel({ insights }) {
  if (!insights) return null;
  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
      <h3>Smart Insights</h3>
      <p>{insights.summary}</p>
    </div>
  );
}
