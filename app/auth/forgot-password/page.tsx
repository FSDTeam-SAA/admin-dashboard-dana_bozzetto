"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/forgot-password`,
        { contact: email }
      );
      toast.success("Check your email for the 6-digit code");
      router.push(`/auth/otp?contact=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error("Failed to send reset email");
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
            <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
          </div>

          <p className="text-slate-200 text-sm mb-8">
            Select which contact details should we use to reset your password
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Enter your Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-white/10 border-white/30 text-white placeholder:text-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-300/40"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 shadow-lg shadow-teal-500/30"
            >
              {isLoading ? "Sending..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

