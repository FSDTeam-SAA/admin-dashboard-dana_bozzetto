"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectsAPI } from "@/lib/api";
import TasksList from "@/components/dashboard/projects/tasks-list";
import AddTaskModal from "@/components/dashboard/projects/add-task-modal";
import Pagination from "@/components/dashboard/pagination";
import TasksTableSkeleton from "@/components/dashboard/skeletons/tasks-skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function TasksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const limit = 10;

  const { data: projectsData = [] } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: async () => {
      const res = await projectsAPI.getAll();
      return res.data as any[];
    },
  });

  const { data: projectDetails } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await projectsAPI.getById(projectId);
      return res.data as any;
    },
    enabled: !!projectId,
  });

  const { data: tasksData, isLoading, error } = useQuery({
    queryKey: ["tasks", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const res = await projectsAPI.getTasks(projectId);
      return res.data as any[];
    },
  });

  const milestoneMap = useMemo(() => {
    const map: Record<string, string> = {};
    (projectDetails?.milestones || []).forEach((m: any) => {
      map[m._id] = m.name;
    });
    return map;
  }, [projectDetails?.milestones]);

  const filteredTasks = useMemo(() => {
    const list = tasksData || [];
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((t) =>
      `${t.name} ${milestoneMap[t.milestoneId] || ""}`.toLowerCase().includes(term)
    );
  }, [tasksData, search, milestoneMap]);

  const totalPages = Math.max(1, Math.ceil((filteredTasks.length || 0) / limit));
  const tasks = filteredTasks
    .slice((page - 1) * limit, page * limit)
    .map((task) => ({
      ...task,
      milestoneName: milestoneMap[task.milestoneId],
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/projects" className="text-teal-500 hover:text-teal-400">
              Projects
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-white">Tasks</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Project Tasks</h1>
          <p className="text-slate-400">Manage and track project tasks and milestones</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
          disabled={!projectId}
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Project</label>
          <select
            value={projectId}
            onChange={(e) => {
              setProjectId(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
          >
            <option value="">Select a project</option>
            {projectsData.map((project: any) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search tasks by name or milestone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {!projectId ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <p className="text-slate-400">Select a project to view tasks</p>
        </div>
      ) : isLoading ? (
        <TasksTableSkeleton />
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
          Error loading tasks. Please try again.
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <p className="text-slate-400">No tasks found</p>
        </div>
      ) : (
        <>
          <TasksList
            tasks={tasks}
            milestones={projectDetails?.milestones || []}
            teamMembers={projectDetails?.teamMembers?.map((m: any) => m.user) || []}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        projectId={projectId}
        milestones={projectDetails?.milestones || []}
        teamMembers={projectDetails?.teamMembers?.map((m: any) => m.user) || []}
      />
    </div>
  );
}
