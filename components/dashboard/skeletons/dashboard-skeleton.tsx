export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 bg-slate-700 rounded w-1/3 mb-2" />
        <div className="h-4 bg-slate-700 rounded w-2/3" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6"
          >
            <div className="w-12 h-12 bg-slate-700 rounded-lg mb-4" />
            <div className="h-4 bg-slate-700 rounded w-2/3 mb-2" />
            <div className="h-8 bg-slate-700 rounded w-1/2" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6"
          >
            <div className="h-6 bg-slate-700 rounded w-1/3 mb-4" />
            <div className="h-80 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
