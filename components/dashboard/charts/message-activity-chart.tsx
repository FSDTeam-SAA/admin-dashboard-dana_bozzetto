"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", messages: 40 },
  { day: "Tue", messages: 65 },
  { day: "Wed", messages: 55 },
  { day: "Thu", messages: 75 },
  { day: "Fri", messages: 45 },
  { day: "Sat", messages: 25 },
  { day: "Sun", messages: 15 },
];

export default function MessageActivityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
          labelStyle={{ color: "#f1f5f9" }}
        />
        <Line
          type="monotone"
          dataKey="messages"
          stroke="#14b8a6"
          strokeWidth={2}
          dot={{ fill: "#14b8a6" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
