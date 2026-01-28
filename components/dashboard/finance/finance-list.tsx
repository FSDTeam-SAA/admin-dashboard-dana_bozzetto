// components/dashboard/finance/finance-list.tsx
"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
import type { FinanceType } from "@/app/dashboard/finance/page"; // adjust path if needed

interface Finance {
  _id: string;
  customId?: string;
  client?: { name: string };
  project?: { name: string };
  totalAmount: number;
  status: string;
  issueDate: string;
  lineItems?: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

export default function FinanceList({
  finances,
  type,
  idLabel,
  onView,
  onEdit,
  onDelete,
}: {
  finances: Finance[];
  type: FinanceType;
  idLabel: string;
  onView: (id: string) => void;
  onEdit: (finance: Finance) => void;
  onDelete: (id: string) => void;
}) {
  const getStatusStyles = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "bg-[#007074]/25 text-teal-200 border border-teal-400/30";
      case "pending":
        return "bg-amber-500/20 text-amber-200 border border-amber-400/30";
      default:
        return "bg-slate-500/20 text-slate-200 border border-slate-400/20";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-slate-200/80 text-sm font-medium">
              <th className="px-6 py-4">{idLabel}</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {finances.map((f) => (
              <tr
                key={f._id}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 text-slate-200/80">
                  {f.customId ?? "-"}
                </td>
                <td className="px-6 py-4 text-slate-200/70">
                  {f.client?.name ?? "-"}
                </td>
                <td className="px-6 py-4 text-slate-200/70">
                  {f.project?.name ?? "-"}
                </td>
                <td className="px-6 py-4 text-slate-100 font-semibold">
                  ${Number(f.totalAmount ?? 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${getStatusStyles(
                      f.status
                    )}`}
                  >
                    {f.status || "-"}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-200/70">
                  {f.issueDate
                    ? new Date(f.issueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onView(f._id)}
                      className="p-2 text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(f)}
                      className="p-2 text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(f._id)}
                      className="p-2 text-red-300 hover:text-red-200 bg-white/10 hover:bg-red-500/20 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {finances.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-slate-200/60"
                >
                  No {type} records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


