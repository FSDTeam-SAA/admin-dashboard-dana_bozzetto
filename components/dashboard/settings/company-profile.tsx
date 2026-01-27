'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Building, MapPin, Mail, Phone } from 'lucide-react';
import { profileAPI } from '@/lib/api';

type ProfilePayload = {
  name: string;
  email: string;
  companyName?: string;
  address?: string;
  phoneNumber?: string;
};

export default function CompanyProfile() {
  const [formData, setFormData] = useState<ProfilePayload>({
    name: '',
    email: '',
    companyName: '',
    address: '',
    phoneNumber: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await profileAPI.get();
      return res.data;
    },
    onError: () => toast.error('Failed to load profile'),
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        email: data.email || '',
        companyName: data.companyName || '',
        address: data.address || '',
        phoneNumber: data.phoneNumber || '',
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (payload: ProfilePayload) => {
      return profileAPI.update(payload);
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const handleInputChange = (field: keyof ProfilePayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Company Profile</h2>
        <p className="text-slate-400">Update your company information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Building className="w-4 h-4" />
            Name
          </label>
          <Input
            type="text"
            value={formData.name}
            disabled={isLoading || updateMutation.isPending}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white"
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Building className="w-4 h-4" />
            Company Name
          </label>
          <Input
            type="text"
            value={formData.companyName}
            disabled={isLoading || updateMutation.isPending}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white"
          />
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Address
          </label>
          <Input
            type="text"
            value={formData.address}
            disabled={isLoading || updateMutation.isPending}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </label>
          <Input
            type="email"
            value={formData.email}
            disabled={isLoading || updateMutation.isPending}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone
          </label>
          <Input
            type="tel"
            value={formData.phoneNumber}
            disabled={isLoading || updateMutation.isPending}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-teal-600 hover:bg-teal-700 text-white w-full"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
