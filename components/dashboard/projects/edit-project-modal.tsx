"use client";

import React from "react";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    _id: string;
    projectNo?: string;
    name: string;
    budget: number;
    startDate: string;
    endDate: string;
    description?: string;
    status?: string;
  } | null;
}

export default function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    projectNo: "",
    name: "",
    budget: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        projectNo: project.projectNo || "",
        name: project.name || "",
        budget: project.budget?.toString() || "",
        startDate: project.startDate ? project.startDate.split("T")[0] : "",
        endDate: project.endDate ? project.endDate.split("T")[0] : "",
        description: project.description || "",
        status: project.status || "Active",
      });
    }
  }, [project]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!project) return;
      return projectsAPI.update(project._id, {
        projectNo: formData.projectNo,
        name: formData.name,
        budget: Number(formData.budget || 0),
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        status: formData.status,
      });
    },
    onSuccess: () => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update project");
    },
  });

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Project</h2>
            <p className="text-slate-200 text-sm">Update project details</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-200 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
          }}
          className="p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 text-sm font-medium mb-2">Project Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-200 text-sm font-medium mb-2">Project No.</label>
              <Input
                type="text"
                value={formData.projectNo}
                onChange={(e) => setFormData({ ...formData, projectNo: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 text-sm font-medium mb-2">Budget Amount</label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-200 text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-200 text-sm font-medium mb-2">End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-200 text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 placeholder:text-slate-200"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="button" onClick={onClose} className="flex-1 bg-white/10 hover:bg-white/20 text-white">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
