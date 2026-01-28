"use client";

import React from "react";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { financeAPI, projectsAPI, clientsAPI } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2 } from "lucide-react";

interface EditFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  finance: any | null;
}

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const typeOptions = ["Proposal", "Estimate", "Invoice", "Contract"];

const statusOptions = [
  "Draft",
  "Pending",
  "Sent",
  "Approved",
  "Rejected",
  "Paid",
  "Unpaid",
  "Overdue",
  "Signed",
];

export default function EditFinanceModal({
  isOpen,
  onClose,
  finance,
}: EditFinanceModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    type: "Invoice",
    projectId: "",
    clientId: "",
    issueDate: "",
    dueDate: "",
    taxRate: 0,
    discount: 0,
    notes: "",
    status: "Pending",
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  useEffect(() => {
    if (finance && isOpen) {
      setFormData({
        type: finance.type || "Invoice",
        projectId: finance.project?._id || finance.project || "",
        clientId: finance.client?._id || finance.client || "",
        issueDate: finance.issueDate ? finance.issueDate.split("T")[0] : "",
        dueDate: finance.dueDate ? finance.dueDate.split("T")[0] : "",
        taxRate: Number(finance.taxRate || 0),
        discount: Number(finance.discount || 0),
        notes: finance.notes || "",
        status: finance.status || "Pending",
      });
      setLineItems(
        Array.isArray(finance.lineItems)
          ? finance.lineItems.map((item: any) => ({
              description: item.description || "",
              quantity: Number(item.quantity || 0),
              rate: Number(item.rate || 0),
              amount: Number(item.amount || 0),
            }))
          : [{ description: "", quantity: 1, rate: 0, amount: 0 }]
      );
    }
  }, [finance, isOpen]);

  const { data: projectsData } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: () => projectsAPI.getAll(),
    select: (response) => response.data || [],
    enabled: isOpen,
  });

  const { data: clientsData } = useQuery({
    queryKey: ["clients", "all"],
    queryFn: () => clientsAPI.getAll(),
    select: (response) => response.data || [],
    enabled: isOpen,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => financeAPI.update(finance._id, data),
    onSuccess: () => {
      toast.success("Finance record updated");
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      queryClient.invalidateQueries({ queryKey: ["finance-count"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update record");
    },
  });

  const calculateTotal = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * formData.taxRate) / 100;
    return subtotal + taxAmount - formData.discount;
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === "quantity" || field === "rate") {
      newItems[index].amount =
        Number(newItems[index].quantity || 0) * Number(newItems[index].rate || 0);
    }
    setLineItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    updateMutation.mutate({
      ...formData,
      lineItems,
      totalAmount: calculateTotal(),
    });
  };

  if (!isOpen || !finance) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white/10 backdrop-blur-2xl border-white/20">
          <h2 className="text-2xl font-bold text-white">Edit {formData.type}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-700 rounded transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none"
              >
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Project</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none"
              >
                <option value="">Select Project</option>
                {projectsData?.map((project: any) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Client *</label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none"
              >
                <option value="">Select Client</option>
                {clientsData?.map((client: any) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Issue Date</label>
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Due Date *</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-3">Line Items</label>
            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2">
                  <Input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(index, "description", e.target.value)}
                    placeholder="Description"
                    className="col-span-5 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, "quantity", Number(e.target.value))}
                    placeholder="Qty"
                    className="col-span-2 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateLineItem(index, "rate", Number(e.target.value))}
                    placeholder="Rate"
                    className="col-span-2 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <div className="col-span-2 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm flex items-center">
                    ${item.amount.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={() => setLineItems(lineItems.filter((_, i) => i !== index))}
                    className="col-span-1 p-2 text-red-400 hover:bg-red-500/10 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setLineItems([
                  ...lineItems,
                  { description: "", quantity: 1, rate: 0, amount: 0 },
                ])
              }
              className="mt-3 flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium text-sm"
            >
              <Plus className="w-4 h-4" /> Add Line Item
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Tax Rate (%)</label>
              <Input
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Discount ($)</label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-lg p-4 text-right">
            <p className="text-slate-400 text-sm mb-1">Total Amount:</p>
            <p className="text-3xl font-bold text-teal-400">${calculateTotal().toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes..."
              rows={3}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
