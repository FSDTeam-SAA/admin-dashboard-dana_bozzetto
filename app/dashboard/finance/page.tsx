// app/(dashboard)/finance/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { financeAPI } from "@/lib/api";

import FinanceList from "@/components/dashboard/finance/finance-list";
import AddFinanceModal from "@/components/dashboard/finance/add-finance-modal";
import Pagination from "@/components/dashboard/pagination";
import FinanceTableSkeleton from "@/components/dashboard/skeletons/finance-skeleton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Plus,
  Search,
  FileText,
  Calculator,
  FileCheck,
  ScrollText,
} from "lucide-react";

export type FinanceType = "proposal" | "estimate" | "invoice" | "contract";

const types: FinanceType[] = ["proposal", "estimate", "invoice", "contract"];

const tabToType: Record<FinanceType, string> = {
  proposal: "Proposal",
  estimate: "Estimate",
  invoice: "Invoices",
  contract: "Contracts",
};

const typeToCreateLabel: Record<FinanceType, string> = {
  proposal: "Proposal",
  estimate: "Estimate",
  invoice: "Invoice",
  contract: "Contract",
};

const typeToIdLabel: Record<FinanceType, string> = {
  proposal: "Proposal ID",
  estimate: "Estimate ID",
  invoice: "Invoice ID",
  contract: "Contract ID",
};

const typeToIcon: Record<FinanceType, React.ElementType> = {
  proposal: FileText,
  estimate: Calculator,
  invoice: FileCheck,
  contract: ScrollText,
};

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<FinanceType>("proposal");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const limit = 8;

  // main list (current tab)
  const { data, isLoading, error } = useQuery({
    queryKey: ["finance", activeTab],
    queryFn: async () => {
      const res = await financeAPI.getAll(tabToType[activeTab]); // your backend expects "Proposal/Estimate/Invoices/Contracts"
      return res.data ?? [];
    },
  });

  // counts for tab badges
  const countsQueries = useQueries({
    queries: types.map((t) => ({
      queryKey: ["finance-count", t],
      queryFn: async () => {
        const res = await financeAPI.getAll(tabToType[t]);
        const arr = res.data ?? [];
        return Array.isArray(arr) ? arr.length : 0;
      },
      staleTime: 60_000,
    })),
  });

  const counts = useMemo(() => {
    const map = {} as Record<FinanceType, number>;
    types.forEach((t, i) => {
      map[t] = (countsQueries[i]?.data as number) ?? 0;
    });
    return map;
  }, [countsQueries]);

  // client-side search
  const filteredFinances = useMemo(() => {
    const list = (data ?? []) as any[];
    const term = search.trim().toLowerCase();
    if (!term) return list;

    return list.filter((f) => {
      const haystack = `${f.customId || ""} ${f.client?.name || ""} ${
        f.project?.name || ""
      }`.toLowerCase();
      return haystack.includes(term);
    });
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filteredFinances.length / limit));
  const paginatedFinances = filteredFinances.slice(
    (page - 1) * limit,
    page * limit,
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            Financial Management
          </h1>
          <p className="text-slate-200/70 mt-2">
            Track Proposals, Estimate, Contracts adn invoices
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#007074] hover:bg-[#005c60] text-white px-6 py-6 rounded-md flex gap-2 items-center text-base transition-all shadow-lg shadow-teal-900/20"
        >
          <Plus className="w-5 h-5" />
          Create New {typeToCreateLabel[activeTab]}
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as FinanceType);
          setPage(1);
          setSearch("");
        }}
        className="w-full"
      >
        {/* Tabs header + content wrapper to match screenshot */}
        <div className="">
          {/* Search row (same block, below tabs) */}
          <div className="px-6 py-4 border-t border-white/10">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300/70" />
              <Input
                type="text"
                placeholder={`Search ${typeToCreateLabel[activeTab]}s...`}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-white/10 border-none text-white placeholder:text-slate-300/50 h-12 focus-visible:ring-1 focus-visible:ring-teal-500/50"
              />
            </div>
          </div>
          {/* Tabs Header */}
          <TabsList className="bg-transparent p-0 h-auto flex gap-0 w-full">
            {types.map((t) => {
              const Icon = typeToIcon[t];
              const active = activeTab === t;

              return (
                <TabsTrigger
                  key={t}
                  value={t}
                  className={[
                    "flex-1 py-4 md:py-5 border-r border-white/10 last:border-r-0 rounded-none",
                    "text-slate-300/70 hover:text-white hover:bg-white/5 transition-all",
                    "data-[state=active]:bg-[#007074] data-[state=active]:text-white",
                  ].join(" ")}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon
                      className={active ? "w-5 h-5" : "w-5 h-5 opacity-70"}
                    />
                    <span className="text-xs md:text-sm font-medium">
                      {tabToType[t]} ({counts[t] ?? 0})
                    </span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Content */}
          <TabsContent value={activeTab} className="m-0">
            <div className=" pb-6">
              {isLoading ? (
                <FinanceTableSkeleton />
              ) : error ? (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200">
                  Error loading data.
                </div>
              ) : (
                <div className="space-y-6">
                  <FinanceList
                    finances={paginatedFinances}
                    type={activeTab}
                    idLabel={typeToIdLabel[activeTab]}
                  />

                  <div className="flex justify-end">
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <AddFinanceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        type={activeTab}
      />
    </div>
  );
}
