"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, Menu } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-slate-700 px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-4 flex-1">
        <button className="p-2 hover:bg-slate-700 rounded-lg transition">
          <Menu className="w-6 h-6 text-slate-300" />
        </button>
        <div className="relative hidden md:block flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Projects, Clients, Documents, Finance...."
            className="w-full border border-white/10 bg-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-slate-700 rounded-lg transition">
          <Bell className="w-6 h-6 text-slate-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-slate-400 capitalize">
              {session?.user?.role || "admin"}
            </p>
          </div>
          <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
            {session?.user?.avatar?.url ? (
              <Image
                src={session.user.avatar.url || "/placeholder.svg"}
                alt={session.user.name || "User"}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold">
                {(session?.user?.name || "A")[0].toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
