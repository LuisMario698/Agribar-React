"use client";

import { RefreshCw, Maximize2, RotateCcw, Plus, Briefcase, Calculator, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getEmployeesForOrganizer } from "@/lib/actions/cuadrillas";

interface NominaTableProps {
    selectedCuadrillaId?: string;
}

export function NominaTable({ selectedCuadrillaId }: NominaTableProps) {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedCuadrillaId) {
            loadEmployees(parseInt(selectedCuadrillaId));
        } else {
            setEmployees([]);
        }
    }, [selectedCuadrillaId]);

    const loadEmployees = async (id: number) => {
        setLoading(true);
        try {
            const result = await getEmployeesForOrganizer(id);
            if (result.success && result.data) {
                setEmployees(result.data.assigned);
            }
        } catch (error) {
            console.error("Error loading employees", error);
        } finally {
            setLoading(false);
        }
    };

    const days = [
        { key: 'dom', label: 'dom', date: '14/12' },
        { key: 'lun', label: 'lun', date: '15/12' },
        { key: 'mar', label: 'mar', date: '16/12' },
        { key: 'mie', label: 'mié', date: '17/12' },
        { key: 'jue', label: 'jue', date: '18/12' },
        { key: 'vie', label: 'vie', date: '19/12' },
        { key: 'sab', label: 'sáb', date: '20/12' },
    ];

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px] w-full">
            {/* Table Header Controls */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                        <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-700 text-lg">Nómina semanal</span>
                    {loading && <span className="text-xs text-slate-400 animate-pulse">Cargando...</span>}
                </div>

                <div className="flex gap-2">
                    <button className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-100 transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto relative">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="sticky top-0 bg-slate-50 z-20 shadow-sm text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="p-4 border-r border-slate-200 w-24 bg-slate-50 sticky left-0 z-30">Clave</th>
                            <th className="p-4 border-r border-slate-200 min-w-[200px] bg-slate-50 sticky left-24 z-30">Empleado</th>
                            {days.map((day) => (
                                <th key={day.key} className="p-2 border-r border-slate-200 text-center bg-green-50/30 min-w-[80px]">
                                    <div className="flex flex-col items-center">
                                        <span className="text-green-700">{day.label}</span>
                                        <span className="text-[10px] text-slate-400 font-normal">{day.date}</span>
                                    </div>
                                </th>
                            ))}
                            <th className="p-4 border-r border-slate-200 text-center bg-blue-50/30 w-24">
                                <div className="flex flex-col items-center gap-1">
                                    <Calculator className="w-3 h-3 text-blue-500" />
                                    Total
                                </div>
                            </th>
                            <th className="p-4 text-center bg-slate-50">
                                <span className="flex items-center justify-center gap-1">
                                    <Plus className="w-3 h-3" /> Perc.
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {selectedCuadrillaId && employees.length > 0 ? (
                            employees.map((emp, index) => (
                                <tr key={emp.id} className="hover:bg-slate-50 group transition-colors">
                                    <td className="p-4 border-r border-slate-100 font-mono text-xs text-slate-500 sticky left-0 bg-white group-hover:bg-slate-50 z-10">
                                        {emp.codigo || "S/C"}
                                    </td>
                                    <td className="p-4 border-r border-slate-100 sticky left-24 bg-white group-hover:bg-slate-50 z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">
                                                {emp.nombre.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-700 text-sm truncate uppercase">{emp.nombre}</div>
                                                <div className="text-[10px] text-slate-400">Jornalero</div>
                                            </div>
                                        </div>
                                    </td>
                                    {days.map((day) => (
                                        <td key={day.key} className="p-2 border-r border-slate-100 text-center bg-green-50/5 group-hover:bg-green-50/10 transition-colors">
                                            {/* Placeholder for input */}
                                            <div className="w-full h-8 bg-white border border-slate-200 rounded-lg shadow-sm"></div>
                                        </td>
                                    ))}
                                    <td className="p-4 border-r border-slate-100 text-center font-bold text-slate-700 bg-blue-50/5">
                                        $0.00
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={11} className="p-20 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-300">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                                            {loading ? <RefreshCw className="w-8 h-8 animate-spin" /> : <Briefcase className="w-8 h-8" />}
                                        </div>
                                        <p className="text-lg font-medium">
                                            {loading ? "Cargando empleados..." : (selectedCuadrillaId ? "La cuadrilla está vacía" : "Sin datos para mostrar")}
                                        </p>
                                        <p className="text-sm">
                                            {loading ? "Por favor espere" : (selectedCuadrillaId ? "Agrega empleados usando el botón 'Armar'" : "Selecciona una cuadrilla para comenzar")}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
