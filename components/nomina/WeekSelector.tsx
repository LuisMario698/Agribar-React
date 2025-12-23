"use client";

import { Calendar, Lock } from "lucide-react";

export function WeekSelector() {
    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col gap-4 h-full relative overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <span className="font-bold text-slate-700">Semana</span>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Activa</span>
            </div>

            <input
                type="text"
                value="14/12 - 20/12/2025"
                readOnly
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 text-center outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />

            <button className="w-full py-2.5 rounded-xl border border-green-200 text-green-700 font-bold text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Cerrar semana
            </button>
        </div>
    );
}
