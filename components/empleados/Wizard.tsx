"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Check, User, Briefcase, DollarSign, Calendar, FileText, MapPin, Hash, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createEmpleado, updateEmpleado } from "@/lib/actions/empleados";

interface WizardProps {
    onSuccess: () => void;
    initialData?: any; // Optional prop for edit mode
}

export function Wizard({ onSuccess, initialData }: WizardProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Personal
        clave: "",
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        estadoOrigen: "Sinaloa",
        curp: "",
        rfc: "",
        nss: "",

        // Step 2: Laboral
        fechaIngreso: new Date().toISOString().split('T')[0],
        registroPatronal: "Seleccionar",

        // Step 3: Nomina
        sueldoDiario: "0.00",
        tieneInfonavit: false,
        descuentoInfonavit: "0",
    });

    // Initialize Data
    useEffect(() => {
        if (initialData) {
            // EDIT MODE: Load existing data
            setFormData({
                clave: initialData.clave || "",
                nombre: initialData.nombre || "",
                apellidoPaterno: initialData.apellidoPaterno || "",
                apellidoMaterno: initialData.apellidoMaterno || "",
                estadoOrigen: initialData.estadoOrigen || "Sinaloa",
                curp: initialData.curp || "",
                rfc: initialData.rfc || "",
                nss: initialData.nss || "",
                fechaIngreso: initialData.fechaIngreso ? new Date(initialData.fechaIngreso).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                registroPatronal: initialData.registroPatronal || "Seleccionar",
                sueldoDiario: initialData.sueldoDiario ? initialData.sueldoDiario.toString() : "0.00",
                tieneInfonavit: initialData.descuentoInfonavit > 0,
                descuentoInfonavit: initialData.descuentoInfonavit ? initialData.descuentoInfonavit.toString() : "0",
            });
        } else {
            // CREATE MODE: Start with empty clave
            setFormData(prev => ({ ...prev, clave: "" }));
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                // Clave is taken directly from the form input now
                sueldoDiario: parseFloat(formData.sueldoDiario),
                descuentoInfonavit: parseFloat(formData.descuentoInfonavit || "0"),
            };

            let res;
            if (initialData) {
                res = await updateEmpleado(initialData.id, payload);
            } else {
                res = await createEmpleado(payload);
            }

            if (res.success) {
                onSuccess();
            } else {
                alert("Error: " + res.error);
            }
        } catch (error) {
            console.error(error);
            alert("Error inesperado");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: "Datos Personales", icon: User },
        { id: 2, title: "Datos Laborales", icon: Briefcase },
        { id: 3, title: "Datos de Nómina", icon: DollarSign },
    ];

    return (
        <div className="bg-slate-50/50 rounded-3xl h-full flex flex-col max-h-[calc(100vh-140px)]">
            {/* Header Title for Edit Mode */}
            {initialData && (
                <div className="px-8 pt-4 pb-0">
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold">
                        <PencilIcon className="w-4 h-4" />
                        Editando empleado: {initialData.nombre} {initialData.apellidoPaterno}
                    </div>
                </div>
            )}

            {/* Steps Tracker */}
            <div className="bg-slate-50 pt-6 pb-4 shrink-0 rounded-t-3xl">
                <div className="flex items-center justify-center gap-4">
                    {steps.map((s, idx) => (
                        <div key={s.id} className="flex items-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                                    step === s.id
                                        ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20"
                                        : step > s.id
                                            ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30"
                                            : "bg-white text-slate-300 border-slate-200"
                                )}>
                                    {step > s.id ? <Check className="w-5 h-5" /> : s.id}
                                </div>
                                <span className={cn(
                                    "text-xs font-bold tracking-wide uppercase",
                                    step === s.id ? "text-[var(--primary)]" : "text-slate-300"
                                )}>{s.title}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={cn(
                                    "h-[3px] w-12 mx-3 rounded-full mt-[-18px]",
                                    step > s.id ? "bg-[var(--primary)]" : "bg-slate-200"
                                )} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Container */}
            <div className="flex-1 px-8 py-4 w-full max-w-7xl mx-auto overflow-y-auto custom-scrollbar no-scrollbar-visible">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-center min-h-[500px]">

                    {/* STEP 1: PERSONAL */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
                            {/* Clave - Full Width on Mobile, 1/3 on Large */}
                            <div className="lg:col-span-1">
                                <InputGroup
                                    icon={Hash}
                                    label="Código Empleado"
                                >
                                    <input
                                        name="clave"
                                        value={formData.clave}
                                        onChange={handleChange}
                                        placeholder="Automatico"
                                        className="w-full bg-[#F3F4F0] rounded-xl px-4 py-3 text-slate-700 font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                                    />
                                </InputGroup>
                            </div>

                            {/* Empty spacer or used for balance if needed */}
                            <div className="hidden lg:block lg:col-span-2"></div>

                            {/* Name Cluster */}
                            <InputGroup icon={User} label="Nombre">
                                <input
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Nombre(s)"
                                    className="w-full bg-[#F3F4F0] rounded-xl px-4 py-3 text-slate-700 font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                                />
                            </InputGroup>

                            <InputGroup icon={User} label="Apellido Paterno">
                                <input
                                    name="apellidoPaterno"
                                    value={formData.apellidoPaterno}
                                    onChange={handleChange}
                                    placeholder="Paterno"
                                    className="w-full bg-[#F3F4F0] rounded-xl px-4 py-3 text-slate-700 font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                                />
                            </InputGroup>

                            <InputGroup icon={User} label="Apellido Materno">
                                <input
                                    name="apellidoMaterno"
                                    value={formData.apellidoMaterno}
                                    onChange={handleChange}
                                    placeholder="Materno"
                                    className="w-full bg-[#F3F4F0] rounded-xl px-4 py-3 text-slate-700 font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                                />
                            </InputGroup>

                            {/* Location & Docs */}
                            <InputGroup icon={MapPin} label="Estado de Origen">
                                <select
                                    name="estadoOrigen"
                                    value={formData.estadoOrigen}
                                    onChange={handleChange}
                                    className="w-full bg-[#F3F4F0] rounded-xl px-4 py-3 text-slate-700 font-medium outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all appearance-none cursor-pointer"
                                >
                                    <option>Sinaloa</option>
                                    <option>Sonora</option>
                                    <option>Baja California</option>
                                </select>
                            </InputGroup>

                            <InputGroup icon={FileText} label="CURP">
                                <input
                                    name="curp"
                                    value={formData.curp}
                                    onChange={handleChange}
                                    maxLength={18}
                                    placeholder="18 dígitos"
                                    className="w-full bg-[#F3F4F0] rounded-xl px-4 py-3 text-slate-700 font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all uppercase"
                                />
                            </InputGroup>

                            <InputGroup icon={FileText} label="RFC">
                                <input
                                    name="rfc"
                                    value={formData.rfc}
                                    onChange={handleChange}
                                    maxLength={13}
                                    placeholder="13 dígitos"
                                    className="w-full bg-[#F3F4F0] rounded-xl px-4 py-3 text-slate-700 font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all uppercase"
                                />
                            </InputGroup>

                            <InputGroup icon={FileText} label="NSS">
                                <input
                                    name="nss"
                                    value={formData.nss}
                                    onChange={handleChange}
                                    maxLength={11}
                                    placeholder="11 dígitos"
                                    className="w-full bg-[#F3F4F0] rounded-xl px-4 py-3 text-slate-700 font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                                />
                            </InputGroup>
                        </div>
                    )}

                    {/* STEP 2: LABORAL */}
                    {step === 2 && (
                        <div className="flex flex-col items-center animate-bg fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-10 text-center text-[var(--primary)]">
                                <Briefcase className="w-14 h-14 mx-auto mb-4 stroke-[1.5]" />
                                <h3 className="text-3xl font-bold tracking-tight">Datos Laborales</h3>
                                <p className="text-slate-400 mt-2 text-lg">Información de contratación</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                                <InputGroup icon={Calendar} label="Fecha de Ingreso">
                                    <input
                                        type="date"
                                        name="fechaIngreso"
                                        value={formData.fechaIngreso}
                                        onChange={handleChange}
                                        className="w-full bg-[#F3F4F0] rounded-xl px-4 py-3 text-slate-700 font-medium outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                                    />
                                </InputGroup>

                                <InputGroup icon={Building2} label="Registro Patronal">
                                    <select
                                        name="registroPatronal"
                                        value={formData.registroPatronal}
                                        onChange={handleChange}
                                        className="w-full bg-[#F3F4F0] rounded-xl px-4 py-3 text-slate-700 font-medium outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all appearance-none cursor-pointer"
                                    >
                                        <option>Seleccionar</option>
                                        <option>Patrón A</option>
                                        <option>Patrón B</option>
                                    </select>
                                </InputGroup>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: NOMINA */}
                    {step === 3 && (
                        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-10 text-center text-[var(--primary)]">
                                <DollarSign className="w-14 h-14 mx-auto mb-4 stroke-[1.5]" />
                                <h3 className="text-3xl font-bold tracking-tight">Información Salarial</h3>
                                <p className="text-slate-400 mt-2 text-lg">Sueldo y prestaciones</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                                <InputGroup icon={DollarSign} label="Sueldo Diario">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--primary)] font-bold text-lg">$</span>
                                        <input
                                            type="number"
                                            name="sueldoDiario"
                                            value={formData.sueldoDiario}
                                            onChange={handleChange}
                                            className="w-full bg-[#F3F4F0] rounded-xl pl-8 pr-4 py-3 text-slate-700 font-medium outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-lg"
                                        />
                                    </div>
                                </InputGroup>

                                <InputGroup
                                    icon={Building2}
                                    label="Descuento Infonavit"
                                    hasToggle
                                    isToggled={formData.tieneInfonavit}
                                    onToggle={() => setFormData(prev => ({ ...prev, tieneInfonavit: !prev.tieneInfonavit }))}
                                >
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">%</span>
                                        <input
                                            type="number"
                                            name="descuentoInfonavit"
                                            value={formData.descuentoInfonavit}
                                            onChange={handleChange}
                                            disabled={!formData.tieneInfonavit}
                                            placeholder="Sin descuento"
                                            className="w-full bg-[#F3F4F0] rounded-xl pl-10 pr-4 py-3 text-slate-700 font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all disabled:opacity-60 disabled:bg-slate-100 text-lg"
                                        />
                                    </div>
                                </InputGroup>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 flex justify-between bg-white/50 backdrop-blur-sm border-t border-slate-100 shrink-0">
                {step > 1 ? (
                    <button
                        onClick={() => setStep(prev => prev - 1)}
                        className="flex items-center gap-2 px-8 py-3 rounded-full font-bold text-[var(--primary)] border border-[var(--primary)]/30 hover:bg-[var(--primary)]/10 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Anterior
                    </button>
                ) : (
                    <button
                        onClick={onSuccess}
                        className="flex items-center gap-2 px-8 py-3 rounded-full font-bold text-slate-500 border border-slate-300 hover:bg-slate-50 transition-all"
                    >
                        Cancelar
                    </button>
                )}

                {step < 3 ? (
                    <button
                        onClick={() => setStep(prev => prev + 1)}
                        className="flex items-center gap-2 px-10 py-3 bg-[var(--primary)] text-white rounded-full font-bold hover:opacity-90 shadow-lg shadow-[var(--primary)]/20 transition-all"
                    >
                        Siguiente
                        <ChevronRight className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-10 py-3 bg-[var(--primary)] text-white rounded-full font-bold hover:opacity-90 shadow-lg shadow-[var(--primary)]/20 transition-all disabled:opacity-70"
                    >
                        {loading ? "Guardando..." : (initialData ? "Actualizar" : "Terminar")}
                        {!loading && <Check className="w-5 h-5" />}
                    </button>
                )}
            </div>
        </div>
    );
}

// Simple internal icon for edit mode alert
function PencilIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
    )
}

// Helper Component for the Card Style
function InputGroup({
    icon: Icon,
    label,
    subLabel,
    hasToggle,
    isToggled,
    onToggle,
    children
}: {
    icon: any;
    label: string;
    subLabel?: string;
    hasToggle?: boolean;
    isToggled?: boolean;
    onToggle?: () => void;
    children: React.ReactNode
}) {
    return (
        <div className="bg-white rounded-2xl w-full p-1">
            <div className="flex items-center justify-between px-1 mb-3">
                <div className="flex items-center gap-2 text-[var(--primary)]">
                    <Icon className="w-5 h-5" />
                    <span className="font-bold text-sm tracking-tight">{label}</span>
                    {subLabel && <span className="text-slate-400 text-xs font-normal ml-1">{subLabel}</span>}
                </div>
                {hasToggle && (
                    <button
                        onClick={onToggle}
                        className={cn(
                            "w-11 h-6 rounded-full relative transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]",
                            isToggled ? "bg-[var(--primary)]" : "bg-slate-200"
                        )}
                    >
                        <span className={cn(
                            "block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out mt-0.5 ml-0.5",
                            isToggled ? "translate-x-5" : "translate-x-0"
                        )} />
                    </button>
                )}
            </div>
            {children}
        </div>
    );
}
