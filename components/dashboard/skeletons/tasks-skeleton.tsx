import { Skeleton } from '@/components/ui/skeleton';

export default function TasksTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-24 bg-slate-700" />
              </th>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-20 bg-slate-700" />
              </th>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-24 bg-slate-700" />
              </th>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-20 bg-slate-700" />
              </th>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-20 bg-slate-700" />
              </th>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-16 bg-slate-700" />
              </th>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-16 bg-slate-700" />
              </th>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-16 bg-slate-700" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-32 bg-slate-700" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-24 bg-slate-700" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-28 bg-slate-700" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-24 bg-slate-700" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-24 bg-slate-700" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-20 bg-slate-700 rounded" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-20 bg-slate-700 rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 bg-slate-700 rounded" />
                    <Skeleton className="h-8 w-8 bg-slate-700 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
