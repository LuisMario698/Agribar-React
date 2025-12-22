"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    totalRecords,
    pageSize,
    onPageChange,
    className
}: PaginationProps) {

    // Generate page numbers to show (e.g., [1, 2, 3, ..., 10])
    // Strategy: Show usually 5 pages max centered around current
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pages = getPageNumbers();

    if (totalRecords === 0) return null;

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1", className)}>

            {/* Info Text */}
            <div className="text-xs font-medium text-slate-500 order-2 sm:order-1">
                Mostrando <span className="font-bold text-slate-700">{Math.min(totalRecords, (currentPage - 1) * pageSize + 1)}</span> - <span className="font-bold text-slate-700">{Math.min(totalRecords, currentPage * pageSize)}</span> de <span className="font-bold text-slate-700">{totalRecords}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 order-1 sm:order-2 bg-slate-50/50 p-1 rounded-xl border border-slate-100 shadow-sm">

                {/* First Page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:shadow-sm hover:text-[var(--primary)] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                    title="Primera Página"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Prev Page */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:shadow-sm hover:text-[var(--primary)] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                    title="Anterior"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 px-2 mx-1 border-x border-slate-100">
                    {pages.map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={cn(
                                "w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold transition-all",
                                currentPage === page
                                    ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
                                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                            )}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Next Page */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:shadow-sm hover:text-[var(--primary)] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                    title="Siguiente"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:shadow-sm hover:text-[var(--primary)] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                    title="Última Página"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
