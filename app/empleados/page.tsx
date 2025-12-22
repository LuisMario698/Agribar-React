"use client";

import { useState, useEffect } from "react";
import { Search, User, UserX, UserCheck, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { Wizard } from "@/components/empleados/Wizard";
import { getEmpleados, toggleEmpleado } from "@/lib/actions/empleados";

export default function EmpleadosPage() {
    const [activeTab, setActiveTab] = useState<"general" | "registro">("general");
    const [empleados, setEmpleados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
    const [searchTerm, setSearchTerm] = useState("");

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmpleado, setSelectedEmpleado] = useState<any>(null);

    const fetchEmpleados = async () => {
        setLoading(true);
        const res = await getEmpleados({
            page: pagination.page,
            pageSize: pagination.pageSize,
            search: searchTerm
        });

        if (res.success && res.data) {
            setEmpleados(res.data);
            setPagination(prev => ({ ...prev, ...res.meta }));
        }
        setLoading(false);
    };

    useEffect(() => {
        if (activeTab === "general") {
            fetchEmpleados();
        }
    }, [activeTab, pagination.page, searchTerm]);

    const handleSuccess = () => {
        setActiveTab("general");
        setIsEditModalOpen(false);
        setSelectedEmpleado(null);
        fetchEmpleados();
    };

    const handleEdit = (empleado: any) => {
        setSelectedEmpleado(empleado);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedEmpleado(null);
    };

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        const res = await toggleEmpleado(id, currentStatus);
        if (res.success) {
            setEmpleados(prev => prev.map(e => e.id === id ? { ...e, activo: !currentStatus } : e));
        } else {
            alert("Error al cambiar estado");
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-4 pb-4 relative">
            {/* Header / Tabs - Compact */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5 flex gap-2 flex-shrink-0">
                <button
                    onClick={() => setActiveTab("general")}
                    className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                        activeTab === "general"
                            ? "bg-[var(--primary)] text-[var(--primary-fg)] shadow-md"
                            : "text-slate-500 hover:bg-slate-50"
                    )}
                >
                    General
                </button>
                <button
                    onClick={() => setActiveTab("registro")}
                    className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                        activeTab === "registro"
                            ? "bg-[var(--primary)] text-[var(--primary-fg)] shadow-md"
                            : "text-slate-500 hover:bg-slate-50"
                    )}
                >
                    Registro (Wizard)
                </button>
            </div>

            {activeTab === "general" ? (
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    {/* Stats Row - Compact */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
                        {/* Total Employees */}
                        <div className="bg-white px-5 py-4 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-slate-500 text-xs font-medium">Total</p>
                                    <p className="text-slate-700 font-bold text-sm">empleados</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-slate-800">
                                {pagination.total}
                            </span>
                        </div>

                        {/* Active Employees */}
                        <div className="bg-white px-5 py-4 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                                    <UserCheck className="w-5 h-5" />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-slate-500 text-xs font-medium">Empleado</p>
                                    <p className="text-slate-700 font-bold text-sm">activos</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-slate-800">
                                {(pagination as any).totalActivos ?? 0}
                            </span>
                        </div>

                        {/* Inactive Employees */}
                        <div className="bg-white px-5 py-4 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                                    <UserX className="w-5 h-5" />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-slate-500 text-xs font-medium">Empleado</p>
                                    <p className="text-slate-700 font-bold text-sm">inactivos</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-slate-800">
                                {(pagination as any).totalInactivos ?? 0}
                            </span>
                        </div>
                    </div>

                    {/* Table Section - Flex Grow */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1 min-h-0">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-3 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar empleado..."
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
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/95 backdrop-blur-sm">Clave</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/95 backdrop-blur-sm">Nombre</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/95 backdrop-blur-sm">Apellido Paterno</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/95 backdrop-blur-sm">Apellido Materno</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/95 backdrop-blur-sm">curp</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/95 backdrop-blur-sm">rfc</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/95 backdrop-blur-sm">Estado</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center bg-slate-50/95 backdrop-blur-sm">Habilitado</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center bg-slate-50/95 backdrop-blur-sm">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={9} className="p-8 text-center text-slate-400">Cargando...</td>
                                        </tr>
                                    ) : empleados.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="p-8 text-center text-slate-400">No se encontraron empleados.</td>
                                        </tr>
                                    ) : (
                                        empleados.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="p-4 text-sm font-semibold text-slate-700">{emp.clave}</td>
                                                <td className="p-4 text-sm font-medium text-slate-600">{emp.nombre}</td>
                                                <td className="p-4 text-sm font-medium text-slate-600">{emp.apellidoPaterno}</td>
                                                <td className="p-4 text-sm font-medium text-slate-600">{emp.apellidoMaterno || "-"}</td>
                                                <td className="p-4 text-xs text-slate-500 font-mono">{emp.curp}</td>
                                                <td className="p-4 text-xs text-slate-500 font-mono">{emp.rfc || "-"}</td>
                                                <td className="p-4 text-sm text-slate-600">{emp.estadoOrigen || "-"}</td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => handleToggleActive(emp.id, emp.activo)}
                                                        className={cn(
                                                            "w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]",
                                                            emp.activo ? "bg-[var(--primary)]" : "bg-slate-200"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out mt-0.5 ml-0.5",
                                                            emp.activo ? "translate-x-6" : "translate-x-0"
                                                        )} />
                                                    </button>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(emp)}
                                                            className="w-8 h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                                                            title="Editar empleado"
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
            ) : (
                <div className="flex-1 overflow-hidden min-h-0">
                    <Wizard onSuccess={handleSuccess} />
                </div>
            )}

            {/* EDIT FLATING MENU (MODAL) */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex-1 overflow-hidden p-2">
                            <Wizard
                                onSuccess={handleSuccess}
                                initialData={selectedEmpleado}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
