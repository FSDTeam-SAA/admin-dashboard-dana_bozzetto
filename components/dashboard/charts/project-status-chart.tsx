"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Completed (235)", value: 235 },
  { name: "Active (12)", value: 12 },
  { name: "InProgress (2)", value: 2 },
  { name: "On Hold (2)", value: 2 },
];

const COLORS = ["#14b8a6", "#3b82f6", "#f97316", "#ef4444"];

export default function ProjectStatusChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
          labelStyle={{ color: "#f1f5f9" }}
        />
        <Legend wrapperStyle={{ color: "#cbd5e1" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
