"use client";

import { useEffect, useState } from "react";
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

interface Task {
  _id: string;
  name: string;
  milestoneId: string;
  assignedTo?: { _id: string; name: string; avatar?: string };
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
}

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  milestones?: { _id: string; name: string }[];
  teamMembers?: { _id: string; name: string }[];
  onUpdated?: () => void;
}

export default function EditTaskModal({
  task,
  isOpen,
  onClose,
  milestones,
  teamMembers,
  onUpdated,
}: EditTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [milestoneId, setMilestoneId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (task) {
      setTaskName(task.name);
      setMilestoneId(task.milestoneId);
      setAssignedTo(task.assignedTo?._id || "");
      setStartDate(task.startDate ? task.startDate.split("T")[0] : "");
      setEndDate(task.endDate ? task.endDate.split("T")[0] : "");
      setPriority(task.priority || "Medium");
    }
  }, [task]);

  const { data: teamMembersData = [] } = useQuery({
    queryKey: ["team-members", "all"],
    queryFn: async () => {
      const res = await projectsAPI.getTeamMembers();
      return res.data as any[];
    },
    enabled: !teamMembers,
  });

  const updateTaskMutation = useMutation({
    mutationFn: () =>
      projectsAPI.updateTask(task._id, {
        name: taskName,
        milestoneId,
        assignedTo,
        startDate,
        endDate,
        priority,
      }),
    onSuccess: () => {
      toast.success("Task updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onUpdated?.();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update task");
    },
  });

  const milestoneOptions = milestones || [];
  const memberOptions = teamMembers || teamMembersData;
  const isFormValid = taskName && milestoneId && assignedTo && startDate && endDate;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update Task details here.</DialogDescription>
            </div>
            <button onClick={onClose} className="text-slate-200 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-slate-200 mb-2 block">Milestone</Label>
            <Select value={milestoneId} onValueChange={setMilestoneId}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
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
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-200 mb-2 block">Change Team Member</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
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
            <Label className="text-slate-200 mb-2 block">Change Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-200 mb-2 block">Change End Date</Label>
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
            onClick={onClose}
            className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={() => updateTaskMutation.mutate()}
            disabled={!isFormValid || updateTaskMutation.isPending}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white gap-2"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
