'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import EditTaskModal from './edit-task-modal';
import DeleteConfirmDialog from '@/components/dashboard/delete-confirm-dialog';

interface Task {
  _id: string;
  name: string;
  milestoneId?: string;
  milestoneName?: string;
  assignedTo?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
}

export default function TasksList({
  tasks,
  milestones = [],
  teamMembers = [],
}: {
  tasks: Task[];
  milestones?: { _id: string; name: string }[];
  teamMembers?: { _id: string; name: string }[];
}) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => projectsAPI.deleteTask(taskId),
    onSuccess: () => {
      toast.success('Task deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setDeletingTaskId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-400';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400';
      case 'Waiting for Approval':
        return 'bg-amber-500/20 text-amber-300';
      default:
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/20 text-red-400';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Task Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Milestone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Assigned To</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Start Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">End Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Priority</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {tasks.map((task) => (
              <tr key={task._id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 text-sm text-white font-medium">{task.name}</td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {task.milestoneName || task.milestoneId || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    {task.assignedTo?.avatar && (
                      <img
                        src={task.assignedTo.avatar || "/placeholder.svg"}
                        alt={task.assignedTo.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-slate-300">{task.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {new Date(task.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {new Date(task.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTask(task)}
                      className="text-teal-400 hover:bg-teal-500/20"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingTaskId(task._id)}
                      className="text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          milestones={milestones}
          teamMembers={teamMembers}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deletingTaskId && (
        <DeleteConfirmDialog
          isOpen={!!deletingTaskId}
          title="Delete Task"
          description="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={() => deleteTaskMutation.mutate(deletingTaskId)}
          onCancel={() => setDeletingTaskId(null)}
          isLoading={deleteTaskMutation.isPending}
        />
      )}
    </>
  );
}
