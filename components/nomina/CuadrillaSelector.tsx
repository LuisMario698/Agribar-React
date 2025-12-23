"use client";

import { Users, UserPlus } from "lucide-react";

export function CuadrillaSelector() {
    return (
        <div className="bg-slate-100/50 rounded-[2rem] p-6 border border-slate-200 min-w-[320px]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-slate-700">Cuadrilla</span>
                </div>

                <button className="px-3 py-1 bg-white border border-green-200 rounded-lg text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm hover:bg-green-50 transition-colors">
                    <UserPlus className="w-3 h-3" />
                    Armar cuadrilla
                </button>
            </div>

            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <select className="w-full bg-transparent p-2 text-sm font-medium text-slate-600 outline-none cursor-pointer">
                    <option>Seleccionar cuadrilla</option>
                    <option>Cuadrilla A - Cosecha</option>
                    <option>Cuadrilla B - Riego</option>
                </select>
            </div>

        </div>
    );
}
