"use client";

import React from "react"

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { financeAPI, projectsAPI, clientsAPI } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2 } from "lucide-react";

interface AddFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'proposal' | 'estimate' | 'invoice' | 'contract';
}

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const typeMapping: Record<string, string> = {
  proposal: 'Proposal',
  estimate: 'Estimate',
  invoice: 'Invoice',
  contract: 'Contract',
};

export default function AddFinanceModal({
  isOpen,
  onClose,
  type = 'invoice',
}: AddFinanceModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    type: typeMapping[type],
    projectId: "",
    clientId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    taxRate: 0,
    discount: 0,
    notes: "",
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  // Fetch projects and clients
  const { data: projectsData } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: () => projectsAPI.getAll(1, 1000),
    select: (response) => response.data.projects || [],
  });

  const { data: clientsData } = useQuery({
    queryKey: ["clients", "all"],
    queryFn: () => clientsAPI.getAll(1, 1000),
    select: (response) => response.data.clients || [],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => financeAPI.create(data),
    onSuccess: () => {
      toast.success("Finance record created successfully");
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      setFormData({
        type: "Invoice",
        projectId: "",
        clientId: "",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: "",
        taxRate: 0,
        discount: 0,
        notes: "",
      });
      setLineItems([{ description: "", quantity: 1, rate: 0, amount: 0 }]);
      onClose();
    },
    onError: () => {
      toast.error("Failed to create finance record");
    },
  });

  const calculateTotal = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * formData.taxRate) / 100;
    return subtotal + taxAmount - formData.discount;
  };

  const updateLineItem = (
    index: number,
    field: keyof LineItem,
    value: any
  ) => {
    const newItems = [...lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === "quantity" || field === "rate") {
      newItems[index].amount =
        newItems[index].quantity * newItems[index].rate;
    }
    setLineItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    createMutation.mutate({
      ...formData,
      lineItems,
      totalAmount: calculateTotal(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
          <h2 className="text-2xl font-bold text-white">Create Invoice</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-700 rounded transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type & Project */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none"
              >
                <option>Invoice</option>
                <option>Contract</option>
                <option>Quote</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Project
              </label>
              <select
                value={formData.projectId}
                onChange={(e) =>
                  setFormData({ ...formData, projectId: e.target.value })
                }
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
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Client *
              </label>
              <select
                value={formData.clientId}
                onChange={(e) =>
                  setFormData({ ...formData, clientId: e.target.value })
                }
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

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Issue Date
              </label>
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) =>
                  setFormData({ ...formData, issueDate: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Due Date *
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-3">
              Line Items
            </label>
            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2">
                  <Input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(index, "description", e.target.value)
                    }
                    placeholder="Description"
                    className="col-span-5 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItem(
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                    placeholder="Qty"
                    className="col-span-2 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      updateLineItem(index, "rate", Number(e.target.value))
                    }
                    placeholder="Rate"
                    className="col-span-2 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <div className="col-span-2 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm flex items-center">
                    ${item.amount.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setLineItems(lineItems.filter((_, i) => i !== index))
                    }
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

          {/* Tax & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Tax Rate (%)
              </label>
              <Input
                type="number"
                value={formData.taxRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taxRate: Number(e.target.value),
                  })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Discount ($)
              </label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount: Number(e.target.value),
                  })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Total */}
          <div className="bg-slate-900 rounded-lg p-4 text-right">
            <p className="text-slate-400 text-sm mb-1">Total Amount:</p>
            <p className="text-3xl font-bold text-teal-400">
              ${calculateTotal().toFixed(2)}
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Add any notes..."
              rows={3}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            >
              {createMutation.isPending ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
