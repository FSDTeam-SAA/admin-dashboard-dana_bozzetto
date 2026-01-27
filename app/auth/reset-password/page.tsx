"use client";

import React from "react"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/reset-password`,
        { email: contact, newPassword: password, confirmPassword }
      );
      toast.success("Password reset successful");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center">
              <div className="w-10 h-10 bg-teal-600 rounded transform rotate-45" />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/auth/login"
              className="text-slate-200 hover:text-white transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Create New Password
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Create Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                className="bg-white/10 border-white/30 text-white placeholder:text-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-300/40 pr-10"
                required
              />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-200 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                className="bg-white/10 border-white/30 text-white placeholder:text-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-300/40 pr-10"
                required
              />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-200 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl border border-white/30 transition"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 shadow-lg shadow-teal-500/30"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
