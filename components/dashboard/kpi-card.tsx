import { type LucideIcon } from "lucide-react";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  // Note: Your image shows specific colors for icons (Orange, Blue, Cyan)
  iconBgColor?: string; 
}

export default function KPICard({
  icon: Icon,
  label,
  value,
  iconBgColor = "bg-cyan-500",
}: KPICardProps) {
  return (
    // Updated background to a semi-transparent dark slate (Glass effect)
    <div className="bg-slate-500/10 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/60 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
        {/* Rounded-full icon background as seen in the UI */}
        <div className={`p-2.5 ${iconBgColor} rounded-lg shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}