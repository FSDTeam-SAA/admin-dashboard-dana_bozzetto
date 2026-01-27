// app/dashboard/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/lib/api";
import KPICard from "@/components/dashboard/kpi-card";
import ChartCard from "@/components/dashboard/chart-card";
import ProjectStatusChart from "@/components/dashboard/charts/project-status-chart";
import MessageActivityChart from "@/components/dashboard/charts/message-activity-chart";
import FinancialTrendsChart from "@/components/dashboard/charts/financial-trends-chart";
import Calendar from "@/components/dashboard/calendar";
import DashboardSkeleton from "@/components/dashboard/skeletons/dashboard-skeleton";
import { Users, FileText, Receipt, TrendingUp, Zap } from "lucide-react";

export default function DashboardPage() {
  const { data: overviewData, isLoading: isLoadingOverview } = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: () => dashboardAPI.getOverview(),
    select: (response) => response.data,
  });

  if (isLoadingOverview) return <DashboardSkeleton />;

  const stats = overviewData || {
    totalClients: 50,
    totalProjects: 56,
    totalInvoices: 30,
    totalRevenue: 115000,
    totalSales: 191500,
  };

  return (
    <div className="min-h-screen p-6 space-y-8 bg-transparent">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 font-medium">
            Welcome back, Randolph Santana!
          </p>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <KPICard
          icon={Users}
          label="Total Clients"
          value={stats.totalClients}
          iconBgColor="bg-orange-500"
        />
        <KPICard
          icon={FileText}
          label="Total Projects"
          value={stats.totalProjects}
          iconBgColor="bg-blue-600"
        />
        <KPICard
          icon={Receipt}
          label="Total Invoices"
          value={stats.totalInvoices}
          iconBgColor="bg-cyan-500"
        />
        <KPICard
          icon={TrendingUp}
          label="Total Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}k`}
          iconBgColor="bg-cyan-500"
        />
        <KPICard
          icon={Zap}
          label="Total Sales"
          value={`$${(stats.totalSales / 1000).toFixed(0)}k`}
          iconBgColor="bg-cyan-500"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <ChartCard title="General Project status" description="Overview of all project categories">
            <ProjectStatusChart />
          </ChartCard>
        </div>
        <div className="lg:col-span-7">
          <ChartCard title="Message Activity" description="Communication trends this week">
            <MessageActivityChart />
          </ChartCard>
        </div>
      </div>

      {/* Financial Trends Full Width */}
      <div className="w-full">
        <ChartCard title="Financial Trends" description="Monthly paid vs unpaid overview">
          <FinancialTrendsChart />
        </ChartCard>
      </div>

      {/* Calendar Section */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-slate-500">{"<"}</span> 
            December 2025 
            <span className="text-slate-500">{">"}</span>
          </h3>
          <span className="text-slate-400 font-bold tracking-widest text-sm">ALFREDO AGENDA</span>
        </div>
        <Calendar />
      </div>
    </div>
  );
}