"use client";

import { useQuery } from "@tanstack/react-query";
import { financeAPI } from "@/lib/api";
import { X } from "lucide-react";

interface FinanceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  financeId: string | null;
}

export default function FinanceDetailsModal({
  isOpen,
  onClose,
  financeId,
}: FinanceDetailsModalProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["finance-details", financeId],
    enabled: isOpen && !!financeId,
    queryFn: async () => {
      const res = await financeAPI.getById(financeId as string);
      return res.data as any;
    },
  });

  if (!isOpen || !financeId) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto text-white">
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {data?.type || "Finance"} - {data?.customId || "Details"}
            </h2>
            <p className="text-slate-200 text-sm">
              {data?.project?.name ? `Project: ${data.project.name}` : "Project details"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-200 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-slate-200 text-center">Loading details...</div>
        ) : isError ? (
          <div className="p-8 text-red-200 text-center">Failed to load details.</div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-slate-300">Client</p>
                <p className="font-semibold">{data?.client?.name || "N/A"}</p>
                <p className="text-sm text-slate-300">{data?.client?.email || ""}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-slate-300">Status</p>
                <p className="font-semibold">{data?.status || "Pending"}</p>
                <p className="text-sm text-slate-300">
                  Issue:{" "}
                  {data?.issueDate
                    ? new Date(data.issueDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3">Line Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-300 text-xs uppercase">
                      <th className="py-2 pr-4">Description</th>
                      <th className="py-2 pr-4">Qty</th>
                      <th className="py-2 pr-4">Rate</th>
                      <th className="py-2 pr-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-200">
                    {(data?.lineItems || []).map((item: any, idx: number) => (
                      <tr key={`${item.description}-${idx}`} className="border-t border-white/10">
                        <td className="py-2 pr-4">{item.description}</td>
                        <td className="py-2 pr-4">{item.quantity}</td>
                        <td className="py-2 pr-4">${Number(item.rate || 0).toLocaleString()}</td>
                        <td className="py-2 pr-4">${Number(item.amount || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                    {(data?.lineItems || []).length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-3 text-slate-300">
                          No line items.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-200">
                <span>Subtotal</span>
                <span>${Number(data?.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-200 mt-2">
                <span>Tax ({data?.taxRate || 0}%)</span>
                <span>${Number(data?.taxAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-200 mt-2">
                <span>Discount</span>
                <span>-${Number(data?.discount || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-white font-semibold mt-3 border-t border-white/10 pt-3">
                <span>Total</span>
                <span>${Number(data?.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>

            {data?.notes && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-slate-200">
                <p className="text-xs uppercase text-slate-400 mb-2">Notes</p>
                <p className="text-sm">{data.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
