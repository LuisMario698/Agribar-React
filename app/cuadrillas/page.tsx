"use client";

import { useState, useEffect } from "react";
import { Search, Users, ShieldCheck, ShieldAlert, Pencil, Check, X, Box, Briefcase, Hash, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { getCuadrillas, createCuadrilla, updateCuadrilla, toggleCuadrilla } from "@/lib/actions/cuadrillas";

export default function CuadrillasPage() {
    // Data State
    const [cuadrillas, setCuadrillas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
    const [searchTerm, setSearchTerm] = useState("");

    // Create Form State
    const [createFormData, setCreateFormData] = useState({
        clave: "",
        nombre: "",
        grupo: "",
        actividad: ""
    });
    const [creating, setCreating] = useState(false);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState({
        clave: "",
        nombre: "",
        grupo: "",
        actividad: ""
    });
    const [updating, setUpdating] = useState(false);

    // Initial Load
    useEffect(() => {
        fetchCuadrillas();
    }, [pagination.page, searchTerm]);

    const fetchCuadrillas = async () => {
        setLoading(true);
        const res = await getCuadrillas({
            page: pagination.page,
            pageSize: pagination.pageSize,
            search: searchTerm
        });
        if (res.success && res.data) {
            setCuadrillas(res.data);
            setPagination(prev => ({ ...prev, ...res.meta }));
        }
        setLoading(false);
    };

    // --- CREATE ACTIONS ---
    const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreateFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await createCuadrilla(createFormData);
            if (res.success) {
                setCreateFormData({ clave: "", nombre: "", grupo: "", actividad: "" });
                fetchCuadrillas();
            } else {
                alert("Error: " + res.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCreating(false);
        }
    };

    // --- EDIT ACTIONS ---
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEditClick = (cuadrilla: any) => {
        setEditId(cuadrilla.id);
        setEditFormData({
            clave: cuadrilla.clave,
            nombre: cuadrilla.nombre,
            grupo: cuadrilla.grupo || "",
            actividad: cuadrilla.actividad || ""
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editId) return;

        setUpdating(true);
        try {
            const res = await updateCuadrilla(editId, editFormData);
            if (res.success) {
                setIsEditModalOpen(false);
                setEditId(null);
                fetchCuadrillas();
            } else {
                alert("Error: " + res.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditId(null);
    };

    // --- TOGGLE ACTION ---
    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        // Optimistic
        setCuadrillas(prev => prev.map(c => c.id === id ? { ...c, activo: !currentStatus } : c));
        const res = await toggleCuadrilla(id, currentStatus);
        if (!res.success) {
            fetchCuadrillas(); // Revert on error
            alert("Error al cambiar estado");
        }
    };

    return (
        <div className="space-y-4 max-w-[1400px] mx-auto pb-4 relative h-[calc(100vh-100px)] flex flex-col">

            {/* TOP SECTION: Registration Form (Always Create) */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex-shrink-0">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20 bg-[var(--primary)]")}>
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 leading-tight">Nueva Cuadrilla</h2>
                        <p className="text-xs text-slate-500 font-medium">Registrar un equipo de trabajo</p>
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleCreateSubmit} className="flex flex-col lg:flex-row gap-6 items-end">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                            <InputGroup icon={Hash} label="Clave">
                                <input
                                    name="clave"
                                    value={createFormData.clave}
                                    onChange={handleCreateChange}
                                    placeholder="Automático"
                                    className="w-full text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
                                />
                            </InputGroup>

                            <InputGroup icon={Users} label="Nombre de Cuadrilla">
                                <input
                                    name="nombre"
                                    value={createFormData.nombre}
                                    onChange={handleCreateChange}
                                    placeholder="Ej. Cuadrilla A"
                                    required
                                    className="w-full text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
                                />
                            </InputGroup>

                            <InputGroup icon={Box} label="Grupo">
                                <input
                                    name="grupo"
                                    value={createFormData.grupo}
                                    onChange={handleCreateChange}
                                    placeholder="Ej. Zona Norte"
                                    className="w-full text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
                                />
                            </InputGroup>

                            <InputGroup icon={Briefcase} label="Actividad Principal">
                                <input
                                    name="actividad"
                                    value={createFormData.actividad}
                                    onChange={handleCreateChange}
                                    placeholder="Ej. Cosecha"
                                    className="w-full text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
                                />
                            </InputGroup>
                        </div>

                        <button
                            type="submit"
                            disabled={creating}
                            className="h-[52px] px-8 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 min-w-[140px] justify-center bg-[var(--primary)] hover:opacity-90 shadow-[var(--primary)]/20"
                        >
                            {creating ? "Guardando..." : "Guardar"}
                            {!creating && <Check className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            </div>

            {/* BOTTOM SECTION: Table Data */}
            <div className="flex flex-col gap-3 flex-1 min-h-0">
                {/* Stats Row */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
                    <span className="text-slate-500 text-sm font-medium">
                        Total Registrados: <span className="text-slate-900 font-bold text-lg ml-1">{pagination.total}</span>
                    </span>

                    <div className="flex gap-4">
                        <div className="bg-[var(--primary)]/10 px-3 py-1.5 rounded-lg border border-[var(--primary)]/20 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></div>
                            <span className="text-xs font-bold text-[var(--primary)]">{(pagination as any).totalActivos ?? 0} Activas</span>
                        </div>
                        <div className="bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <span className="text-xs font-bold text-red-700">{(pagination as any).totalInactivos ?? 0} Inactivas</span>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1 min-h-0">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-3 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar cuadrilla..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                            />
                        </div>

                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            totalRecords={pagination.total}
                            pageSize={pagination.pageSize}
                            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                            className="w-full md:w-auto py-0"
                        />
                    </div>
                    <div className="flex-1 overflow-auto relative">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                <tr>
                                    <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/95 backdrop-blur-sm">Clave</th>
                                    <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/95 backdrop-blur-sm">Nombre</th>
                                    <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/95 backdrop-blur-sm">Grupo</th>
                                    <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/95 backdrop-blur-sm">Actividad</th>
                                    <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center bg-slate-50/95 backdrop-blur-sm">Miembros</th>
                                    <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center bg-slate-50/95 backdrop-blur-sm">Habilitado</th>
                                    <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center bg-slate-50/95 backdrop-blur-sm">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={7} className="p-10 text-center text-slate-400">Cargando datos...</td></tr>
                                ) : cuadrillas.length === 0 ? (
                                    <tr><td colSpan={7} className="p-10 text-center text-slate-400">No hay cuadrillas registradas</td></tr>
                                ) : (
                                    cuadrillas.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-6 text-sm font-bold text-slate-700">{item.clave}</td>
                                            <td className="p-6 text-sm font-semibold text-slate-800">{item.nombre}</td>
                                            <td className="p-6 text-sm font-medium text-slate-600">{item.grupo || "-"}</td>
                                            <td className="p-6 text-sm font-medium text-slate-600">{item.actividad || "-"}</td>
                                            <td className="p-6 text-center">
                                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                                                    {item._count?.empleados || 0}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <button
                                                    onClick={() => handleToggleActive(item.id, item.activo)}
                                                    className={cn(
                                                        "w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]",
                                                        item.activo ? "bg-[var(--primary)]" : "bg-slate-200"
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out mt-0.5 ml-0.5",
                                                        item.activo ? "translate-x-6" : "translate-x-0"
                                                    )} />
                                                </button>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(item)}
                                                        className="w-9 h-9 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20 bg-[var(--primary)]")}>
                                    <Pencil className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 leading-tight">Editar Cuadrilla</h2>
                                    <p className="text-xs text-slate-500 font-medium">Modificando datos registrados</p>
                                </div>
                            </div>
                            <button
                                onClick={closeEditModal}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8">
                            <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup icon={Hash} label="Clave">
                                        <input
                                            name="clave"
                                            value={editFormData.clave}
                                            onChange={handleEditChange}
                                            placeholder="Automático"
                                            className="w-full text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
                                        />
                                    </InputGroup>

                                    <InputGroup icon={Users} label="Nombre de Cuadrilla">
                                        <input
                                            name="nombre"
                                            value={editFormData.nombre}
                                            onChange={handleEditChange}
                                            placeholder="Ej. Cuadrilla A"
                                            required
                                            className="w-full text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
                                        />
                                    </InputGroup>

                                    <InputGroup icon={Box} label="Grupo">
                                        <input
                                            name="grupo"
                                            value={editFormData.grupo}
                                            onChange={handleEditChange}
                                            placeholder="Ej. Zona Norte"
                                            className="w-full text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
                                        />
                                    </InputGroup>

                                    <InputGroup icon={Briefcase} label="Actividad Principal">
                                        <input
                                            name="actividad"
                                            value={editFormData.actividad}
                                            onChange={handleEditChange}
                                            placeholder="Ej. Cosecha"
                                            className="w-full text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
                                        />
                                    </InputGroup>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="px-6 py-3 rounded-xl font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 bg-[var(--primary)] hover:opacity-90 shadow-[var(--primary)]/20"
                                    >
                                        {updating ? "Actualizando..." : "Guardar Cambios"}
                                        {!updating && <Check className="w-5 h-5" />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper for minimal fields
function InputGroup({ icon: Icon, label, children }: { icon: any, label: string, children: React.ReactNode }) {
    return (
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 focus-within:ring-2 focus-within:ring-[var(--primary)]/20 focus-within:border-[var(--primary)]/50 transition-all">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{label}</span>
            </div>
            {children}
        </div>
    );
}
