"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    _id: string;
    projectNo?: string;
    name: string;
    budget: number;
    startDate: string;
    endDate: string;
    description?: string;
    status?: string;
    coverImage?: { url?: string };
    teamMembers?: { user: { _id: string; name: string; avatar?: { url?: string } } }[];
    documents?: {
      _id: string;
      name: string;
      file?: { url?: string };
      url?: string;
      type?: string;
      status?: string;
    }[];
  } | null;
}

export default function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    projectNo: "",
    name: "",
    budget: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "Active",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);

  // ✅ Team member search + dropdown states
  const [teamSearch, setTeamSearch] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const teamBoxRef = useRef<HTMLDivElement | null>(null);

  const { data: teamMembersData = [] } = useQuery({
    queryKey: ["team-members", "all"],
    queryFn: async () => {
      const res = await projectsAPI.getTeamMembers();
      return res.data as any[];
    },
    enabled: isOpen,
  });

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (teamBoxRef.current && !teamBoxRef.current.contains(e.target as Node)) {
        setShowTeamDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Load project data into form
  useEffect(() => {
    if (project) {
      setFormData({
        projectNo: project.projectNo || "",
        name: project.name || "",
        budget: project.budget?.toString() || "",
        startDate: project.startDate ? project.startDate.split("T")[0] : "",
        endDate: project.endDate ? project.endDate.split("T")[0] : "",
        description: project.description || "",
        status: project.status || "Active",
      });

      setCoverImage(null);
      setCoverPreview(project.coverImage?.url || "");
      setDocuments([]);
      setSelectedTeamMembers(
        (project.teamMembers || [])
          .map((m) => m?.user?._id)
          .filter((id): id is string => Boolean(id))
      );

      // reset search UI
      setTeamSearch("");
      setShowTeamDropdown(false);
    }
  }, [project]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocuments(files);
  };

  // ✅ Search filter
  const filteredTeamMembers = useMemo(() => {
    const q = teamSearch.trim().toLowerCase();
    if (!q) return teamMembersData;
    return teamMembersData.filter((m: any) =>
      String(m?.name || "").toLowerCase().includes(q)
    );
  }, [teamMembersData, teamSearch]);

  // ✅ Selected members full objects (for chips below)
  const selectedMembersFull = useMemo(() => {
    const map = new Map(teamMembersData.map((m: any) => [m._id, m]));
    return selectedTeamMembers.map((id) => map.get(id)).filter(Boolean);
  }, [teamMembersData, selectedTeamMembers]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!project) return;

      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });

      if (selectedTeamMembers.length > 0) {
        payload.append("teamMembers", JSON.stringify(selectedTeamMembers));
      }

      if (coverImage) {
        payload.append("coverImage", coverImage);
      }

      documents.forEach((file) => payload.append("documents", file));
      return projectsAPI.update(project._id, payload);
    },
    onSuccess: () => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      setCoverImage(null);
      setCoverPreview("");
      setDocuments([]);
      setTeamSearch("");
      setShowTeamDropdown(false);

      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update project");
    },
  });

  const isFormValid = useMemo(() => !!(formData.name && formData.budget), [formData]);

  // ✅ Toggle member:
  // - add -> close dropdown + clear search
  // - remove -> keep dropdown state unchanged
  const handleTeamMemberToggle = (id: string) => {
    setSelectedTeamMembers((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];

      if (!exists) {
        setShowTeamDropdown(false);
        setTeamSearch("");
      }

      return next;
    });
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-black/70 z-50">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Project</h2>
            <p className="text-slate-200 text-sm">Update project details</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-200 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isFormValid) {
              toast.error("Please fill in all required fields");
              return;
            }
            updateMutation.mutate();
          }}
          className="p-6 space-y-6"
        >
          {/* Cover */}
          <div>
            <label className="block text-slate-200 text-sm font-medium mb-3">
              Update Cover Photo
            </label>
            <div className="relative">
              <div className="border border-white/20 rounded-xl p-6 text-center hover:border-teal-400 transition cursor-pointer bg-white/5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="h-32 w-32 object-cover rounded-xl mx-auto"
                  />
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-slate-200 mx-auto" />
                    <p className="text-slate-200 text-sm">JPG, PNG, Max size 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 text-sm font-medium mb-2">Project Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-200 text-sm font-medium mb-2">Project No.</label>
              <Input
                type="text"
                value={formData.projectNo}
                onChange={(e) => setFormData({ ...formData, projectNo: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-200"
              />
            </div>
          </div>

          {/* Budget + status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 text-sm font-medium mb-2">Budget Amount</label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-200 text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-black/40 border border-white/20 text-white rounded-xl px-3 py-2"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-200 text-sm font-medium mb-2">End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-200 text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 placeholder:text-slate-200"
            />
          </div>

          {/* Upload new docs */}
          <div>
            <label className="block text-slate-200 text-sm font-medium mb-2">
              Upload Additional Documents
            </label>
            <div className="border border-white/20 rounded-xl p-4 text-center bg-white/5">
              <input
                type="file"
                multiple
                onChange={handleDocumentsChange}
                className="w-full text-slate-200"
              />
              <p className="text-xs text-slate-300 mt-2">Drag and drop files or browse</p>
            </div>
          </div>

          {/* Existing documents */}
          <div>
            <label className="block text-slate-200 text-sm font-medium mb-2">
              Existing Documents
            </label>
            {project.documents && project.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-white">{doc.name}</p>
                      <p className="text-xs text-slate-300">
                        {(doc.type || "Document")} {doc.status ? `- ${doc.status}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="inline-flex items-center gap-2 text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded px-3 py-2"
                    >
                      <FileText className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-300 text-sm">No documents yet.</div>
            )}
          </div>

          {/* ✅ Assign Team Members (Search dropdown + selected chips below) */}
          <div ref={teamBoxRef}>
            <label className="block text-slate-200 text-sm font-medium mb-2">
              Assign Team Members
            </label>

            <div className="relative">
              <Input
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                onFocus={() => setShowTeamDropdown(true)}
                placeholder="Search team members..."
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-200"
              />

              {showTeamDropdown && (
                <div className="absolute left-0 right-0 z-50 mt-2 rounded-xl border border-white/20 bg-black/80 backdrop-blur-xl p-2 max-h-64 overflow-y-auto">
                  {filteredTeamMembers.length === 0 ? (
                    <p className="text-slate-300 text-sm px-2 py-2">No members found.</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredTeamMembers.map((member: any) => (
                        <button
                          key={member._id}
                          type="button"
                          onClick={() => handleTeamMemberToggle(member._id)}
                          className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-200 hover:bg-white/10"
                        >
                          <span className="truncate">{member.name}</span>
                          <span className="text-xs text-slate-300">
                            {selectedTeamMembers.includes(member._id) ? "Selected" : "Select"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedMembersFull.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedMembersFull.map((m: any) => (
                  <div
                    key={m._id}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200"
                  >
                    <span className="text-sm">{m.name}</span>
                    <button
                      type="button"
                      onClick={() => handleTeamMemberToggle(m._id)}
                      className="text-slate-300 hover:text-white"
                      aria-label={`Remove ${m.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      {previewDoc && (
        <DocumentPreviewModal document={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}
    </div>
  );
}

function DocumentPreviewModal({ document, onClose }: { document: any; onClose: () => void }) {
  const url = document?.file?.url || document?.url;
  const isImage = url ? /\.(jpg|jpeg|png|gif|webp)$/i.test(url) : false;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white w-full max-w-3xl rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold">Document Preview</h3>
          <button onClick={onClose} className="p-2 text-slate-200 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {url ? (
            isImage ? (
              <img src={url} alt={document?.name || "Document"} className="w-full rounded-xl" />
            ) : (
              <iframe src={url} className="w-full h-[400px] rounded-xl" />
            )
          ) : (
            <p className="text-slate-300">No document available.</p>
          )}

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-teal-300"
            >
              Download Document
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
