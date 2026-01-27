"use client";

import React from "react"

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

export default function OTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!isNaN(Number(value)) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((digit) => !digit)) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-otp`,
        { contact, otp: otp.join("") }
      );
      toast.success("OTP verified successfully");
      router.push(`/auth/reset-password?contact=${encodeURIComponent(contact)}`);
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/forgot-password`,
        { contact }
      );
      toast.success("OTP sent again");
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
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
              Enter Security Code
            </h1>
          </div>

          <p className="text-slate-200 text-sm mb-8">
            Please check your Email for a message with your code. Your code is
            6 numbers long.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Input */}
            <div className="flex gap-4 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className="w-12 h-12 bg-white/10 border-2 border-white/30 rounded-lg text-white text-center text-xl font-bold focus:border-teal-400 focus:ring-2 focus:ring-teal-300/40 focus:outline-none transition"
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 shadow-lg shadow-teal-500/30"
            >
              {isLoading ? "Verifying..." : "Continue"}
            </Button>

            {/* Resend */}
            <p className="text-center text-slate-200 text-sm">
              Didn't receive code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-teal-300 hover:text-white font-semibold transition disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Resend"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
