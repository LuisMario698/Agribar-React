"use client";

import { Users, UserPlus } from "lucide-react";

import { CuadrillaOrganizerModal } from "./CuadrillaOrganizerModal";
import { useState } from "react";

import { getCuadrillas } from "@/lib/actions/cuadrillas";
import { useEffect } from "react";

export function CuadrillaSelector() {
    const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);
    const [cuadrillas, setCuadrillas] = useState<any[]>([]);
    const [selectedCuadrillaId, setSelectedCuadrillaId] = useState<string>("");

    useEffect(() => {
        getCuadrillas().then((result) => {
            if (result.success && result.data) {
                setCuadrillas(result.data);
            }
        });
    }, [isOrganizerOpen]);

    return (
        <>
            <div className="bg-slate-100/50 rounded-[2rem] p-6 border border-slate-200 min-w-[320px]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-slate-700">Cuadrilla</span>
                    </div>

                    <button
                        onClick={() => setIsOrganizerOpen(true)}
                        className="px-3 py-1 bg-white border border-green-200 rounded-lg text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm hover:bg-green-50 transition-colors"
                    >
                        <UserPlus className="w-3 h-3" />
                        Armar cuadrilla
                    </button>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <select
                        value={selectedCuadrillaId}
                        onChange={(e) => setSelectedCuadrillaId(e.target.value)}
                        className="w-full bg-transparent p-2 text-sm font-medium text-slate-600 outline-none cursor-pointer"
                    >
                        <option value="">Seleccionar cuadrilla</option>
                        {cuadrillas.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

            </div>

            <CuadrillaOrganizerModal
                isOpen={isOrganizerOpen}
                onClose={() => setIsOrganizerOpen(false)}
                initialCuadrillaId={selectedCuadrillaId}
            />
        </>
    );
}
