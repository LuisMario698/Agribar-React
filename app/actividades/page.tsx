"use client";

import { useState, useEffect } from "react";
import { Search, Briefcase, Pencil, Check, X, Hash, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { getActividades, createActividad, updateActividad } from "@/lib/actions/actividades";

export default function ActividadesPage() {
    // Data State
    const [actividades, setActividades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
    const [searchTerm, setSearchTerm] = useState("");

    // Create Form State
    const [createFormData, setCreateFormData] = useState({
        clave: "",
        nombre: "",
    });
    const [creating, setCreating] = useState(false);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState({
        clave: "",
        nombre: "",
    });
    const [updating, setUpdating] = useState(false);

    // Initial Load
    useEffect(() => {
        fetchActividades();
    }, [pagination.page, searchTerm]);

    const fetchActividades = async () => {
        setLoading(true);
        const res = await getActividades({
            page: pagination.page,
            pageSize: pagination.pageSize,
            search: searchTerm
        });
        if (res.success && res.data) {
            setActividades(res.data);
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
            const res = await createActividad(createFormData);
            if (res.success) {
                setCreateFormData({ clave: "", nombre: "" });
                fetchActividades();
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

    const handleEditClick = (actividad: any) => {
        setEditId(actividad.id);
        setEditFormData({
            clave: actividad.clave,
            nombre: actividad.nombre,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editId) return;

        setUpdating(true);
        try {
            const res = await updateActividad(editId, editFormData);
            if (res.success) {
                setIsEditModalOpen(false);
                setEditId(null);
                fetchActividades();
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

    return (
        <div className="max-w-[1600px] mx-auto pb-4 relative h-[calc(100vh-120px)] overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-6 h-full">

                {/* LEFT COLUMN: Registration Form */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6 h-full">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex-shrink-0">
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20 bg-[var(--primary)]")}>
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 leading-tight">Nueva Actividad</h2>
                                <p className="text-xs text-slate-500 font-medium">Panel de registro</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-5">
                                <InputGroup icon={Hash} label="Clave">
                                    <input
                                        name="clave"
                                        value={createFormData.clave}
                                        onChange={handleCreateChange}
                                        placeholder="Automático"
                                        className="w-full text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
                                    />
                                </InputGroup>

                                <InputGroup icon={Target} label="Nombre de Actividad">
                                    <input
                                        name="nombre"
                                        value={createFormData.nombre}
                                        onChange={handleCreateChange}
                                        placeholder="Ej. Cosecha"
                                        required
                                        className="w-full text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
                                    />
                                </InputGroup>

                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="h-[52px] w-full rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 bg-[var(--primary)] hover:opacity-90 shadow-[var(--primary)]/20 mt-2"
                                >
                                    {creating ? "Guardando..." : "Guardar Registro"}
                                    {!creating && <Check className="w-5 h-5" />}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Info Card - Fills remaining space visually */}
                    <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-3xl p-6 relative overflow-hidden hidden lg:block flex-1">
                        <div className="relative z-10">
                            <h3 className="text-[var(--primary)] font-bold text-lg mb-2">Gestión de Actividades</h3>
                            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                Mantén el catálogo actualizado. Estas actividades son fundamentales para el cálculo de la nómina semanal.
                                <br /><br />
                                Usa el buscador para filtrar rápidamente registros existentes.
                            </p>
                            <div className="mt-4">
                                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Registrados</span>
                                <p className="text-slate-900 font-bold text-3xl">{pagination.total}</p>
                            </div>
                        </div>
                        <Briefcase className="absolute -bottom-8 -right-8 w-48 h-48 text-[var(--primary)]/5 rotate-12" />
                    </div>
                </div>

                {/* RIGHT COLUMN: Table Data */}
                <div className="w-full lg:w-2/3 flex flex-col h-full bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                    {/* Header/Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-3 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar en actividades..."
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

                    {/* Table Content - Flex Grow with Auto Scroll if absolutely needed even with pagination */}
                    <div className="flex-1 overflow-auto relative">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider w-32 bg-slate-50/95 backdrop-blur-sm">Clave</th>
                                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/95 backdrop-blur-sm">Nombre</th>
                                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32 bg-slate-50/95 backdrop-blur-sm">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={3} className="p-20 text-center text-slate-400 flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 rounded-full border-4 border-[var(--primary)]/30 border-t-[var(--primary)] animate-spin"></div>
                                        <span>Cargando...</span>
                                    </td></tr>
                                ) : actividades.length === 0 ? (
                                    <tr><td colSpan={3} className="p-20 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                                <Briefcase className="w-6 h-6 text-slate-300" />
                                            </div>
                                            <p>Sin resultados.</p>
                                        </div>
                                    </td></tr>
                                ) : (
                                    actividades.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="p-5 text-sm font-bold text-slate-700">{item.clave}</td>
                                            <td className="p-5 text-sm font-semibold text-slate-800">{item.nombre}</td>
                                            <td className="p-5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(item)}
                                                        className="w-8 h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                                                        title="Editar"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
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
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20 bg-[var(--primary)]")}>
                                    <Pencil className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 leading-tight">Editar Actividad</h2>
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

                                    <InputGroup icon={Target} label="Nombre de Actividad">
                                        <input
                                            name="nombre"
                                            value={editFormData.nombre}
                                            onChange={handleEditChange}
                                            placeholder="Ej. Cosecha"
                                            required
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
