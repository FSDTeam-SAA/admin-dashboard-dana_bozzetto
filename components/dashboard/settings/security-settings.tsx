'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { securityAPI } from '@/lib/api';

export default function SecuritySettings() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (data.newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      return securityAPI.changePassword(data.currentPassword, data.newPassword);
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error.message || 'Failed to change password';
      toast.error(message);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const PasswordInput = ({
    label,
    field,
    showKey,
  }: {
    label: string;
    field: 'current' | 'new' | 'confirm';
    showKey: 'currentPassword' | 'newPassword' | 'confirmPassword';
  }) => (
    <div>
      <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
        <Lock className="w-4 h-4" />
        {label}
      </label>
      <div className="relative">
        <Input
          type={showPasswords[field] ? 'text' : 'password'}
          value={formData[showKey]}
          onChange={(e) => handleInputChange(showKey, e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white pr-10"
        />
        <button
          type="button"
          onClick={() =>
            setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
        >
          {showPasswords[field] ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Change Password</h2>
        <p className="text-slate-400">Update your password to keep your account secure</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PasswordInput
          label="Password"
          field="current"
          showKey="currentPassword"
        />

        <PasswordInput label="New Password" field="new" showKey="newPassword" />

        <PasswordInput
          label="Confirm Password"
          field="confirm"
          showKey="confirmPassword"
        />

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
