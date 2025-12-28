"use client";

import { Calendar, Lock } from "lucide-react";

import { getActivePeriod } from "@/lib/actions/periodos";
import { useEffect, useState } from "react";

export function WeekSelector() {
    const [periodData, setPeriodData] = useState<any>(null);

    useEffect(() => {
        getActivePeriod().then((result) => {
            if (result.success && result.data) {
                setPeriodData(result.data);
            }
        });
    }, []);

    if (!periodData) {
        return (
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col gap-4 h-full relative overflow-hidden animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-2" />
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-8 bg-slate-100 rounded-xl mt-auto" />
            </div>
        );
    }

    const { fechaInicio, fechaFin, tipoPeriodo } = periodData;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit" });
    };

    const formatYear = (dateString: string) => {
        const date = new Date(dateString);
        return date.getFullYear();
    };

    const periodLabel = {
        "SEMANAL": "Semana",
        "QUINCENAL": "Quincena",
        "CATORCENAL": "Catorcena",
        "ESPECIAL": "Periodo"
    }[tipoPeriodo as string] || "Periodo";

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col gap-4 h-full relative overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <span className="font-bold text-slate-700">{periodLabel}</span>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Activa</span>
            </div>

            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 text-center">
                {formatDate(fechaInicio)} - {formatDate(fechaFin)}/{formatYear(fechaFin)}
            </div>

            <button className="w-full py-2.5 rounded-xl border border-green-200 text-green-700 font-bold text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Cerrar {periodLabel.toLowerCase()}
            </button>
        </div>
    );
}
