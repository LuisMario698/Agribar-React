"use client";

import { Check, User, Calendar, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export function NominaHeader() {
    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[var(--primary)] ml-2">Nóminas</h1>

            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium tracking-wide">CONF. SEMANAL</span>
            </div>
        </div>
    );
}
