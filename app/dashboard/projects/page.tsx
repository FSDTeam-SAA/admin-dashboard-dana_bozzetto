"use client";

import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsAPI } from "@/lib/api";
import ProjectsList from "@/components/dashboard/projects/projects-list";
import Pagination from "@/components/dashboard/pagination";
import ProjectsTableSkeleton from "@/components/dashboard/skeletons/projects-skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddProjectModal from "@/components/dashboard/projects/add-project-modal";
import EditProjectModal from "@/components/dashboard/projects/edit-project-modal";
import ProjectDetailsModal from "@/components/dashboard/projects/project-details-modal";
import DeleteConfirmDialog from "@/components/dashboard/delete-confirm-dialog";
import { toast } from "sonner";

type ApiProject = {
  _id: string;
  projectNo?: string;
  name: string;
  client?: {
    name: string;
    avatar?: { url?: string };
  };
  coverImage?: { url?: string };
  startDate: string;
  endDate: string;
  budget: number;
};

type UiProject = {
  _id: string;
  projectNo: string;
  name: string;
  clientName: string;
  startDate: string;
  endDate: string;
  budget: number;
  imageUrl?: string;
  clientAvatar?: string;
};

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 7;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewProjectId, setViewProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<ApiProject | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await projectsAPI.getAll();
      return res.data as ApiProject[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsAPI.delete(id),
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setDeletingProjectId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete project");
    },
  });

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data || [];
    return (data || []).filter((p) => {
      const haystack = `${p.name} ${p.projectNo || ""} ${p.client?.name || ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil((filteredProjects.length || 0) / limit));

  const projects: UiProject[] = useMemo(
    () =>
      (filteredProjects || [])
        .slice((page - 1) * limit, page * limit)
        .map((p) => ({
          _id: p._id,
          projectNo: p.projectNo ?? "-",
          name: p.name,
          clientName: p.client?.name ?? "-",
          clientAvatar: p.client?.avatar?.url || undefined,
          imageUrl: p.coverImage?.url || undefined,
          startDate: p.startDate,
          endDate: p.endDate,
          budget: Number(p.budget ?? 0),
        })),
    [filteredProjects, page]
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-white tracking-tight">
          Projects
        </h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#007074] hover:bg-[#005c60] text-white px-6 py-6 rounded-md flex gap-2 items-center text-lg"
        >
          <Plus className="w-5 h-5" />
          Add New Project
        </Button>
      </div>

      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <Input
          type="text"
          placeholder="Search Projects, Clients, Documents..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-10 bg-white/10 border-none text-white placeholder:text-slate-400 h-12 focus-visible:ring-1 focus-visible:ring-teal-500"
        />
      </div>

      {isLoading ? (
        <ProjectsTableSkeleton />
      ) : error ? (
        <div className="text-red-400 p-4 bg-red-900/20 rounded">
          Error loading data.
        </div>
      ) : (
        <>
          <ProjectsList
            projects={projects}
            onView={(id) => setViewProjectId(id)}
            onEdit={(id) => {
              const project = (data || []).find((p) => p._id === id) || null;
              setEditingProject(project);
            }}
            onDelete={(id) => setDeletingProjectId(id)}
          />
          <div className="flex justify-end mt-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}

      <AddProjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        project={editingProject}
      />
      <ProjectDetailsModal
        isOpen={!!viewProjectId}
        projectId={viewProjectId}
        onClose={() => setViewProjectId(null)}
      />
      {deletingProjectId && (
        <DeleteConfirmDialog
          isOpen={!!deletingProjectId}
          title="Delete Project"
          description="Are you sure you want to delete this project? This action cannot be undone."
          onConfirm={() => deleteMutation.mutate(deletingProjectId)}
          onCancel={() => setDeletingProjectId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

