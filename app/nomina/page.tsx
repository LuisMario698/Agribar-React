"use client";

import { NominaHeader } from "@/components/nomina/NominaHeader";
import { WeekSelector } from "@/components/nomina/WeekSelector";
import { CuadrillaSelector } from "@/components/nomina/CuadrillaSelector";
import { NominaStats } from "@/components/nomina/NominaStats";
import { NominaTable } from "@/components/nomina/NominaTable";
import { Save, AlertCircle } from "lucide-react";

import { PeriodCreationModal } from "@/components/features/PeriodCreationModal";
import { useState, useEffect } from "react";
import { hasActivePeriod } from "@/lib/actions/periodos";

export default function NominaPage() {
    const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);

    useEffect(() => {
        const checkActivePeriod = async () => {
            const result = await hasActivePeriod();
            console.log("Active Period Check Result:", result);
            if (!result.active) {
                // Only open if NO active period and NO error (or handle error differently)
                // For now, if count is -1 (error), we might default to NOT opening to be safe, or alert
                if (result.count !== -1) {
                    setIsPeriodModalOpen(true);
                } else {
                    console.error("Failed to check active period:", result.error);
                }
            }
        };
        checkActivePeriod();
    }, []);

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
            <PeriodCreationModal
                isOpen={isPeriodModalOpen}
                onClose={() => setIsPeriodModalOpen(false)}
            />

            {/* Header Removed */}

            {/* Control Area */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-72 flex-shrink-0">
                    <WeekSelector />
                </div>

                <div className="flex-1 flex flex-col justify-between gap-4">
                    <div className="flex flex-col xl:flex-row gap-6 h-full">
                        <CuadrillaSelector />
                        <NominaStats />
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <NominaTable />

            {/* Footer Actions */}
            <div className="flex flex-col items-center gap-4 mt-8">
                <button className="px-10 py-4 bg-slate-200 text-white font-bold rounded-xl text-lg flex items-center gap-3 shadow-sm hover:opacity-90 disabled:opacity-50 transition-all cursor-not-allowed uppercase tracking-wider">
                    <Save className="w-6 h-6" />
                    Guardar
                </button>

                <div className="bg-orange-50 text-orange-600 px-6 py-3 rounded-full border border-orange-100 flex items-center gap-2 text-sm font-semibold animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    Selecciona o arma una cuadrilla para continuar
                </div>
            </div>
        </div>
    );
}
