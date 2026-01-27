"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  DollarSign,
  MessageSquare,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Projects", href: "/dashboard/projects" },
  { icon: DollarSign, label: "Finance", href: "/dashboard/finance" },
  { icon: Users, label: "Clients", href: "/dashboard/clients" },
  { icon: User, label: "Team Members", href: "/dashboard/team-members" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: Settings, label: "Setting", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-teal-700 text-white flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-teal-600">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={300} height={300} className="w-[254px] h-[80px]"/>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-teal-100 hover:bg-teal-600/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-teal-600">
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: "/auth/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-teal-100 hover:bg-teal-600/50 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
