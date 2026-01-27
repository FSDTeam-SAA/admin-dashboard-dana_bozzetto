"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsAPI } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X } from "lucide-react";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  milestones?: { _id: string; name: string }[];
  teamMembers?: { _id: string; name: string }[];
  onCreated?: () => void;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  projectId,
  milestones,
  teamMembers,
  onCreated,
}: AddTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [milestoneId, setMilestoneId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
  const queryClient = useQueryClient();

  const { data: projectsData = [] } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: async () => {
      const res = await projectsAPI.getAll();
      return res.data as any[];
    },
    enabled: !projectId,
  });

  const { data: teamMembersData = [] } = useQuery({
    queryKey: ["team-members", "all"],
    queryFn: async () => {
      const res = await projectsAPI.getTeamMembers();
      return res.data as any[];
    },
    enabled: !teamMembers,
  });

  const { data: projectDetails } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: async () => {
      const res = await projectsAPI.getById(selectedProjectId);
      return res.data as any;
    },
    enabled: !!selectedProjectId && !milestones,
  });

  const milestoneOptions = milestones || projectDetails?.milestones || [];
  const memberOptions = teamMembers || teamMembersData;

  const createTaskMutation = useMutation({
    mutationFn: () =>
      projectsAPI.createTask({
        name: taskName,
        projectId: projectId || selectedProjectId,
        milestoneId,
        assignedTo,
        priority,
        startDate,
        endDate,
      }),
    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project", selectedProjectId] });
      resetForm();
      onClose();
      onCreated?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create task");
    },
  });

  const resetForm = () => {
    setTaskName("");
    setMilestoneId("");
    setAssignedTo("");
    setStartDate("");
    setEndDate("");
    setPriority("Medium");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid =
    taskName && milestoneId && assignedTo && startDate && endDate && (projectId || selectedProjectId);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Create new Task with fill those information.</DialogDescription>
            </div>
            <button onClick={handleClose} className="text-slate-200 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {!projectId && (
            <div>
              <Label className="text-slate-200 mb-2 block">Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {projectsData.map((project: any) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-slate-200 mb-2 block">Milestone</Label>
            <Select value={milestoneId} onValueChange={setMilestoneId}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select Milestone" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                {milestoneOptions.map((milestone: any) => (
                  <SelectItem key={milestone._id} value={milestone._id}>
                    {milestone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-200 mb-2 block">Task Name</Label>
            <Input
              type="text"
              placeholder="Add any additional notes or comments..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
            />
          </div>

          <div>
            <Label className="text-slate-200 mb-2 block">Select Team Member</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select Team Member" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                {memberOptions.map((member: any) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-200 mb-2 block">Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-200 mb-2 block">End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-200 mb-2 block">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={() => createTaskMutation.mutate()}
            disabled={!isFormValid || createTaskMutation.isPending}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white gap-2"
          >
            Add Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
