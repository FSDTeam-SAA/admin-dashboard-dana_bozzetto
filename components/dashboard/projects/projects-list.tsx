"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";

interface Project {
  _id: string;
  projectNo: string;
  name: string;
  clientName: string;
  startDate: string;
  endDate: string;
  budget: number;
  imageUrl?: string;
  clientAvatar?: string;
}

export default function ProjectsList({
  projects,
  onView,
  onEdit,
  onDelete,
}: {
  projects: Project[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-slate-300 text-sm font-medium">
            <th className="px-6 py-5">Project No.</th>
            <th className="px-6 py-5">Project Name</th>
            <th className="px-6 py-5">Client Name</th>
            <th className="px-6 py-5">Starting Date</th>
            <th className="px-6 py-5">End Date</th>
            <th className="px-6 py-5">Budget</th>
            <th className="px-6 py-5 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {projects.map((project) => (
            <tr
              key={project._id}
              className="hover:bg-white/5 transition-colors group"
            >
              <td className="px-6 py-4 text-slate-300">
                {project.projectNo || "561"}
              </td>

              {/* Project Name with Thumbnail */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 rounded overflow-hidden bg-slate-700 flex-shrink-0">
                    <img
                      src={project.imageUrl || "/api/placeholder/64/40"}
                      alt="project"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-slate-200 font-medium">
                    {project.name}
                  </span>
                </div>
              </td>

              {/* Client Name with Avatar */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <img
                    src={project.clientAvatar || "/api/placeholder/24/24"}
                    className="w-6 h-6 rounded-full"
                    alt="client"
                  />
                  {project.clientName}
                </div>
              </td>

              <td className="px-6 py-4 text-slate-400 text-sm">
                {new Date(project.startDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>

              <td className="px-6 py-4 text-slate-400 text-sm">
                {new Date(project.endDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>

              <td className="px-6 py-4 text-slate-200 font-medium">
                $
                {project.budget.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>

              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => onView(project._id)}
                    className="bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border-none rounded-md px-4 py-1 h-9 transition-all"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <button
                    onClick={() => onEdit(project._id)}
                    className="p-2 text-slate-300 hover:bg-slate-700 rounded transition"
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(project._id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded transition"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
