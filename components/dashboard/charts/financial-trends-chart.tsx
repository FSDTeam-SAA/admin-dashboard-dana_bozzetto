"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", paid: 4000, unpaid: 2400 },
  { month: "Feb", paid: 3000, unpaid: 1398 },
  { month: "Mar", paid: 2000, unpaid: 9800 },
  { month: "Apr", paid: 2780, unpaid: 3908 },
  { month: "May", paid: 1890, unpaid: 4800 },
  { month: "Jun", paid: 2390, unpaid: 3800 },
  { month: "Jul", paid: 3490, unpaid: 4300 },
  { month: "Aug", paid: 2000, unpaid: 1800 },
  { month: "Sep", paid: 2780, unpaid: 2908 },
  { month: "Oct", paid: 1890, unpaid: 3800 },
  { month: "Nov", paid: 2390, unpaid: 3800 },
  { month: "Dec", paid: 3490, unpaid: 4300 },
];

export default function FinancialTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
          labelStyle={{ color: "#f1f5f9" }}
        />
        <Legend wrapperStyle={{ color: "#cbd5e1" }} />
        <Bar dataKey="paid" fill="#14b8a6" radius={[8, 8, 0, 0]} />
        <Bar dataKey="unpaid" fill="#f97316" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
