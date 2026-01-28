"use client";

import { useQuery } from "@tanstack/react-query";
import { clientsAPI, financeAPI, projectsAPI } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string | null;
}

export default function ClientDetailsModal({
  isOpen,
  onClose,
  clientId,
}: ClientDetailsModalProps) {
  const { data: client, isLoading } = useQuery({
    queryKey: ["client-details", clientId],
    enabled: isOpen && !!clientId,
    queryFn: async () => {
      const res = await clientsAPI.getById(clientId as string);
      return res.data as any;
    },
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["client-projects", clientId],
    enabled: isOpen && !!clientId,
    queryFn: async () => {
      const res = await projectsAPI.getAll({ clientId: clientId as string });
      return res.data as any[];
    },
  });

  const { data: finances = [] } = useQuery({
    queryKey: ["client-finance", clientId],
    enabled: isOpen && !!clientId,
    queryFn: async () => {
      const res = await financeAPI.getAll({ clientId: clientId as string });
      return res.data as any[];
    },
  });

  if (!isOpen || !clientId) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto text-white">
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-white/10">
          <div className="flex items-center gap-3">
            <img
              src={client?.avatar?.url || "/placeholder.svg"}
              alt={client?.name || "Client"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">
                {client?.name || "Client Details"}
              </h2>
              <p className="text-slate-200 text-sm">
                {client?.clientId ? `Client ID: ${client.clientId}` : "Client info"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-200 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-slate-200 text-center">Loading client...</div>
        ) : (
          <div className="p-6 space-y-6">
            <Tabs defaultValue="info">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="info">Client Info</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-slate-300">Email</p>
                    <p className="font-semibold">{client?.email || "N/A"}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-slate-300">Company</p>
                    <p className="font-semibold">{client?.companyName || "N/A"}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-slate-300">Phone</p>
                    <p className="font-semibold">{client?.phoneNumber || "N/A"}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-slate-300">Address</p>
                    <p className="font-semibold">{client?.address || "N/A"}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-3">
                {(projects || []).length === 0 ? (
                  <div className="text-slate-300">No projects found.</div>
                ) : (
                  <div className="space-y-2">
                    {projects.map((project: any) => (
                      <div
                        key={project._id}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                      >
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-xs text-slate-300">
                            Status: {project.status || "Active"}
                          </p>
                        </div>
                        <div className="text-sm text-slate-200">
                          ${Number(project.budget || 0).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="finance" className="space-y-3">
                {(finances || []).length === 0 ? (
                  <div className="text-slate-300">No finance records found.</div>
                ) : (
                  <div className="space-y-2">
                    {finances.map((fin: any) => (
                      <div
                        key={fin._id}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                      >
                        <div>
                          <p className="font-medium">
                            {fin.type} - {fin.customId}
                          </p>
                          <p className="text-xs text-slate-300">
                            Status: {fin.status}
                          </p>
                        </div>
                        <div className="text-sm text-slate-200">
                          ${Number(fin.totalAmount || 0).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
