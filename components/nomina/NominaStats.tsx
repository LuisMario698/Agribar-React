"use client";

import { Users, Banknote, DollarSign } from "lucide-react";

export function NominaStats() {
    return (
        <div className="flex gap-4 w-full">
            {/* Empleados Count */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-200 flex-1 flex flex-col justify-center items-center gap-2">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Empleados</span>
                </div>
                <span className="text-3xl font-black text-slate-800">--</span>
            </div>

            {/* Acumulado */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-200 flex-1 flex flex-col justify-center items-center gap-2">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Banknote className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold uppercase">Acumulado</span>
                </div>
                <span className="text-3xl font-black text-slate-800">--</span>
            </div>

            {/* Total Semana (Mocked with value from image) */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-200 flex-1 flex flex-col justify-center items-center gap-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -mr-4 -mt-4" />

                <div className="flex items-center gap-2 text-slate-500 mb-1 relative z-10">
                    <span className="text-xs font-bold uppercase">Total semana</span>
                </div>
                <div className="flex items-center gap-1 text-slate-800 relative z-10">
                    <DollarSign className="w-5 h-5 text-green-600 stroke-[3]" />
                    <span className="text-3xl font-black tracking-tight text-slate-900">$100</span>
                </div>
            </div>
        </div>
    );
}
