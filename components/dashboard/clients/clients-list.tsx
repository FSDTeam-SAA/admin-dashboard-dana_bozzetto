"use client";

import { Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";

interface Client {
  _id: string;
  name: string;
  email: string;
  clientId: string;
  companyName: string;
  phoneNumber?: string;
  avatar?: {
    url: string;
  };
  createdAt: string;
}

export default function ClientsList({
  clients,
  onView,
  onEdit,
  onDelete,
}: {
  clients: Client[];
  onView: (id: string) => void;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}) {
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
                Company
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Phone
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
            {clients.map((client) => (
              <tr key={client._id} className="hover:bg-slate-700/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                      {client.avatar?.url ? (
                        <Image
                          src={client.avatar.url || "/placeholder.svg"}
                          alt={client.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-sm">
                          {client.name[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-white">{client.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {client.email}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {client.companyName}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {client.phoneNumber || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(client._id)}
                      className="p-2 text-slate-400 hover:bg-slate-700 rounded transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(client)}
                      className="p-2 text-slate-400 hover:bg-slate-700 rounded transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(client._id)}
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
