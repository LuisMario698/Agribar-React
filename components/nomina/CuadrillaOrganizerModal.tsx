"use client";

import { X, Search, Plus, Minus, Users, ArrowRight, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { getCuadrillas, getEmployeesForOrganizer, assignEmployeeToCuadrilla, removeEmployeeFromCuadrilla } from "@/lib/actions/cuadrillas";

interface CuadrillaOrganizerModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialCuadrillaId?: string;
}

export function CuadrillaOrganizerModal({ isOpen, onClose, initialCuadrillaId }: CuadrillaOrganizerModalProps) {
    const [cuadrillas, setCuadrillas] = useState<any[]>([]);
    const [selectedCuadrilla, setSelectedCuadrilla] = useState<string>("");

    // Lists
    const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
    const [assignedEmployees, setAssignedEmployees] = useState<any[]>([]);

    // Search filters
    const [searchAvailable, setSearchAvailable] = useState("");
    const [searchAssigned, setSearchAssigned] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadCuadrillas();
            // If passed an initial ID, use it.
            if (initialCuadrillaId) {
                setSelectedCuadrilla(initialCuadrillaId);
                // No need to call loadEmployees here, the selectedCuadrilla useEffect will handle it.
            }
        }
    }, [isOpen, initialCuadrillaId]);

    useEffect(() => {
        if (selectedCuadrilla) {
            loadEmployees(parseInt(selectedCuadrilla));
        } else {
            setAssignedEmployees([]);
            setAvailableEmployees([]);
        }
    }, [selectedCuadrilla]);

    const loadCuadrillas = async () => {
        const result = await getCuadrillas();
        if (result.success && result.data) {
            setCuadrillas(result.data);
        }
    };

    const loadEmployees = async (cuadrillaId: number) => {
        setLoading(true);
        const result = await getEmployeesForOrganizer(cuadrillaId);
        if (result.success && result.data) {
            setAssignedEmployees(result.data.assigned);
            setAvailableEmployees(result.data.available);
        }
        setLoading(false);
    };

    const handleAssign = async (employeeId: number) => {
        if (!selectedCuadrilla) return;
        const result = await assignEmployeeToCuadrilla(employeeId, parseInt(selectedCuadrilla));
        if (result.success) {
            loadEmployees(parseInt(selectedCuadrilla));
        }
    };

    const handleRemove = async (employeeId: number) => {
        if (!selectedCuadrilla) return;
        const result = await removeEmployeeFromCuadrilla(employeeId, parseInt(selectedCuadrilla));
        if (result.success) {
            // Reload lists
            loadEmployees(parseInt(selectedCuadrilla));
        }
    };

    if (!isOpen) return null;

    const filteredAvailable = availableEmployees.filter(emp =>
        emp.nombre.toLowerCase().includes(searchAvailable.toLowerCase())
    );

    const filteredAssigned = assignedEmployees.filter(emp =>
        emp.nombre.toLowerCase().includes(searchAssigned.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header - Themed */}
                <div className="bg-[var(--primary)] px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Armar Cuadrilla</h2>
                            <p className="text-white/80">Organiza y gestiona tu equipo de trabajo</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden p-8 flex flex-col gap-6 bg-slate-50">
                    {/* Selector */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-6 shadow-sm">
                        <div className="flex items-center gap-3 text-[var(--primary)] font-bold px-4 border-r border-slate-200">
                            <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
                                <ArrowRight className="w-5 h-5 text-[var(--primary)]" />
                            </div>
                            <div>
                                <div className="text-xs text-[var(--primary)] uppercase tracking-wide">Cuadrilla Activa</div>
                                <div className="text-sm text-slate-500 font-normal">Selecciona la cuadrilla a gestionar</div>
                            </div>
                        </div>
                        <select
                            value={selectedCuadrilla}
                            onChange={(e) => setSelectedCuadrilla(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                        >
                            <option value="">Selecciona una cuadrilla...</option>
                            {cuadrillas.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {selectedCuadrilla ? (
                        <div className="flex-1 flex gap-6 overflow-hidden">
                            {/* Left: Available */}
                            <div className="flex-1 flex flex-col bg-blue-50/50 rounded-2xl border border-blue-100 overflow-hidden">
                                <div className="p-4 bg-blue-100/50 border-b border-blue-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-bold text-blue-800">Empleados Disponibles</h3>
                                    </div>
                                    <div className="text-xs text-blue-600 font-medium">{availableEmployees.length} empleados</div>
                                </div>
                                <div className="p-4 border-b border-blue-200 bg-white">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar empleado..."
                                            value={searchAvailable}
                                            onChange={(e) => setSearchAvailable(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    {filteredAvailable.map(emp => (
                                        <div key={emp.id} className="bg-white p-3 rounded-xl border border-blue-100 flex items-center justify-between hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {emp.nombre.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700 text-sm uppercase">{emp.nombre}</div>
                                                    <div className="text-xs text-slate-500">Jornalero • Código: {emp.codigo || "N/A"}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAssign(emp.id)}
                                                className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Center Action (Visual) */}
                            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                                <div className="p-3 bg-white rounded-full shadow-sm border border-slate-200">
                                    <ArrowRight className="w-6 h-6" />
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px]">Toca para agregar/quitar</div>
                            </div>

                            {/* Right: Assigned */}
                            <div className="flex-1 flex flex-col bg-[var(--primary)]/5 rounded-2xl border border-[var(--primary)]/10 overflow-hidden">
                                <div className="p-4 bg-[var(--primary)]/10 border-b border-[var(--primary)]/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users className="w-5 h-5 text-[var(--primary)]" />
                                        <h3 className="font-bold text-[var(--primary)]">Cuadrilla: {cuadrillas.find(c => c.id === parseInt(selectedCuadrilla))?.nombre}</h3>
                                    </div>
                                    <div className="text-xs text-[var(--primary)] font-medium">{assignedEmployees.length} empleados en la cuadrilla</div>
                                </div>
                                <div className="p-4 border-b border-[var(--primary)]/10 bg-white">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar en cuadrilla..."
                                            value={searchAssigned}
                                            onChange={(e) => setSearchAssigned(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    {filteredAssigned.map(emp => (
                                        <div key={emp.id} className="bg-white p-3 rounded-xl border border-[var(--primary)]/10 flex items-center justify-between hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-xs">
                                                    {emp.nombre.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700 text-sm uppercase">{emp.nombre}</div>
                                                    <div className="text-xs text-slate-500">Jornalero • Código: {emp.codigo || "N/A"}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(emp.id)}
                                                className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <Users className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg font-medium">Selecciona una cuadrilla para comenzar a gestionar</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-slate-100 flex justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <X className="w-5 h-5" />
                        Cancelar
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-slate-200 text-slate-500 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed" // Visual only for now as changes are instant
                    >
                        <Save className="w-5 h-5" />
                        Guardar Cuadrilla
                    </button>
                </div>
            </div>
        </div>
    );
}
