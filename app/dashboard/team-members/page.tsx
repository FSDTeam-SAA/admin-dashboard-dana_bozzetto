"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { teamMembersAPI } from "@/lib/api";
import TeamMembersList from "@/components/dashboard/team/team-members-list";
import AddTeamMemberModal from "@/components/dashboard/team/add-team-member-modal";
import Pagination from "@/components/dashboard/pagination";
import TeamMembersTableSkeleton from "@/components/dashboard/skeletons/team-skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type TeamMember = {
  _id: string;
  name: string;
  email: string;
  role: string;
  employeeId?: string;
  avatar?: { url?: string } | string;
  createdAt: string;
  totalProjects?: number;
};

export default function TeamMembersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const res = await teamMembersAPI.getAll();
      return res.data as TeamMember[];
    },
  });

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data || [];
    return (data || []).filter((m) => {
      const haystack = `${m.name} ${m.email} ${m.employeeId || ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil((filteredMembers.length || 0) / limit));
  const members = filteredMembers.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Team Members</h1>
          <p className="text-slate-300">Manage your team</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search team members..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-slate-400"
        />
      </div>

      {isLoading ? (
        <TeamMembersTableSkeleton />
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500 text-red-200 rounded-lg p-4">
          Error loading team members. Please try again.
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
          <p className="text-slate-300">No team members found</p>
        </div>
      ) : (
        <>
          <TeamMembersList members={members} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <AddTeamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

