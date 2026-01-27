"use client";

import { useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { teamMembersAPI } from "@/lib/api";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  employeeId?: string;
  address?: string;
  phoneNumber?: string;
  avatar?: string | { url?: string };
  createdAt: string;
  totalProjects?: number;
}

export default function TeamMembersList({
  members,
}: {
  members: TeamMember[];
}) {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => teamMembersAPI.delete(id),
    onSuccess: () => {
      toast.success("Team member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete team member");
    },
  });

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-white/5">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Employee ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Projects
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {members.map((member) => (
              <tr key={member._id} className="hover:bg-slate-700/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                      {member.avatar ? (
                        <Image
                          src={
                            typeof member.avatar === "string"
                              ? member.avatar
                              : member.avatar.url || "/placeholder.svg"
                          }
                          alt={member.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-sm">
                          {member.name[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-white">{member.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {member.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full text-xs font-semibold capitalize">
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {member.employeeId || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {member.totalProjects || 0}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {new Date(member.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:bg-slate-700 rounded transition">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:bg-slate-700 rounded transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (deleteId === member._id) {
                          deleteMutation.mutate(member._id);
                        } else {
                          setDeleteId(member._id);
                        }
                      }}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded transition"
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
    </div>
  );
}
