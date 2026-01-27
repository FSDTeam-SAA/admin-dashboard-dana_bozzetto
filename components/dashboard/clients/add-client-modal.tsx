"use client";

import React from "react"

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsAPI } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload } from "lucide-react";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddClientModal({
  isOpen,
  onClose,
}: AddClientModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    clientId: "",
    companyName: "",
    phoneNumber: "",
    address: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const formDataToSend = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "avatar") {
          formDataToSend.append(key, data[key]);
        }
      });
      if (imageFile) {
        formDataToSend.append("avatar", imageFile);
      }
      return clientsAPI.create(formDataToSend);
    },
    onSuccess: () => {
      toast.success("Client created successfully");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setFormData({
        name: "",
        email: "",
        clientId: "",
        companyName: "",
        phoneNumber: "",
        address: "",
      });
      setImageFile(null);
      setImagePreview("");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create client");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.companyName) {
      toast.error("Please fill in all required fields");
      return;
    }
    createMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
          <h2 className="text-2xl font-bold text-white">Add New Client</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-700 rounded transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-3">
              Upload Avatar
            </label>
            <div className="relative">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-teal-500 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-slate-300 text-sm">
                      JPG, PNG, Max size 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Client name"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="client@example.com"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Company & Client ID */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Company Name *
              </label>
              <Input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                placeholder="Company name"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Client ID
              </label>
              <Input
                type="text"
                value={formData.clientId}
                onChange={(e) =>
                  setFormData({ ...formData, clientId: e.target.value })
                }
                placeholder="CL-001"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Phone & Address */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="Phone number"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Address
              </label>
              <Input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Address"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            >
              {createMutation.isPending ? "Creating..." : "Add Client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
