"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-all ${
              page === i 
              ? "bg-[#007074] text-white shadow-lg shadow-teal-900/20" 
              : "bg-black/40 text-slate-400 hover:bg-white/10"
            }`}
          >
            {i}
          </button>
        );
      } else if (i === page - 2 || i === page + 2) {
        pages.push(<MoreHorizontal key={i} className="w-8 text-slate-600" />);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded bg-black/40 text-slate-400 disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </button>
      
      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded bg-black/40 text-slate-400 disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}