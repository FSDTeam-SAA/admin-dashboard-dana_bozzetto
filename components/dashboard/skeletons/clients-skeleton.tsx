export default function ClientsTableSkeleton() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/50">
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 bg-slate-700 rounded w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-slate-700 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
