"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientsAPI } from "@/lib/api";
import ClientsList from "@/components/dashboard/clients/clients-list";
import AddClientModal from "@/components/dashboard/clients/add-client-modal";
import EditClientModal from "@/components/dashboard/clients/edit-client-modal";
import ClientDetailsModal from "@/components/dashboard/clients/client-details-modal";
import Pagination from "@/components/dashboard/pagination";
import ClientsTableSkeleton from "@/components/dashboard/skeletons/clients-skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DeleteConfirmDialog from "@/components/dashboard/delete-confirm-dialog";
import { toast } from "sonner";

type Client = {
  _id: string;
  name: string;
  email: string;
  clientId?: string;
  companyName?: string;
  phoneNumber?: string;
  address?: string;
  avatar?: { url?: string };
  createdAt: string;
};

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewClientId, setViewClientId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await clientsAPI.getAll();
      return res.data as Client[];
    },
  });

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data || [];
    return (data || []).filter((c) => {
      const haystack = `${c.name} ${c.email} ${c.clientId || ""} ${c.companyName || ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil((filteredClients.length || 0) / limit));
  const clients = filteredClients.slice((page - 1) * limit, page * limit);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientsAPI.delete(id),
    onSuccess: () => {
      toast.success("Client deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setDeletingClientId(null);
    },
    onError: () => {
      toast.error("Failed to delete client");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Clients</h1>
          <p className="text-slate-300">Manage all your clients</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Client
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-slate-400"
        />
      </div>

      {isLoading ? (
        <ClientsTableSkeleton />
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500 text-red-200 rounded-lg p-4">
          Error loading clients. Please try again.
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
          <p className="text-slate-300">No clients found</p>
        </div>
      ) : (
        <>
          <ClientsList
            clients={clients}
            onView={(id) => setViewClientId(id)}
            onEdit={(client) => setEditingClient(client)}
            onDelete={(id) => setDeletingClientId(id)}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditClientModal
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        client={editingClient}
      />

      <ClientDetailsModal
        isOpen={!!viewClientId}
        onClose={() => setViewClientId(null)}
        clientId={viewClientId}
      />

      {deletingClientId && (
        <DeleteConfirmDialog
          isOpen={!!deletingClientId}
          title="Delete Client"
          description="Are you sure you want to delete this client? This action cannot be undone."
          onConfirm={() => deleteMutation.mutate(deletingClientId)}
          onCancel={() => setDeletingClientId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

