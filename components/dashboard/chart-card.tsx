import React from "react"
interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function ChartCard({
  title,
  description,
  children,
}: ChartCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:border-slate-600 transition">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-slate-400">{description}</p>
        )}
      </div>
      <div className="h-80">{children}</div>
    </div>
  );
}
