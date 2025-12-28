"use client";

import { useState } from "react";
import { ChevronLeft, Calendar, User, Clock, Check, Sparkles, Hash, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { createPeriod } from "@/lib/actions/periodos";

interface PeriodCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function PeriodCreationModal({ isOpen, onClose, onSuccess }: PeriodCreationModalProps) {
    const [selectedType, setSelectedType] = useState<string | null>("semanal");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const periodTypes = [
        {
            id: "semanal",
            title: "Semanal",
            days: 7,
            description: "Pagos realizados cada 7 días. El más común en agrícola.",
            icon: Calendar,
            color: "bg-blue-500"
        },
        {
            id: "quincenal",
            title: "Quincenal",
            days: 15,
            description: "Pagos los días 15 y 30 de cada mes.",
            icon: Hash,
            color: "bg-indigo-500"
        },
        {
            id: "catorcenal",
            title: "Catorcenal",
            days: 14,
            description: "Pagos cada 14 días (dos semanas exactas).",
            icon: Calendar,
            color: "bg-sky-500"
        },
        {
            id: "custom",
            title: "Personalizado",
            days: 0,
            description: "Define tu propia frecuencia de días (ej. cada 10 días).",
            icon: User,
            color: "bg-pink-500"
        },
    ];

    const handleSelect = (id: string) => {
        setSelectedType(id);
    };



    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const start = e.target.value;
        setStartDate(start);

        if (start && selectedType) {
            const type = periodTypes.find(t => t.id === selectedType);
            if (type && type.days > 0) {
                const date = new Date(start);
                // Add days (minus 1 because start day counts as day 1)
                date.setDate(date.getDate() + type.days - 1);
                setEndDate(date.toISOString().split('T')[0]);
            } else {
                setEndDate("");
            }
        } else {
            setEndDate("");
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };

    const handlePaymentDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentDate(e.target.value);
    };

    // Calculate valid payment range based on endDate
    const getPaymentDateRange = () => {
        if (!endDate) return { min: undefined, max: undefined };

        const end = new Date(endDate);

        // Min: 1 day before end date
        const minDate = new Date(end);
        minDate.setDate(end.getDate() - 1);

        // Max: 3 days after end date
        const maxDate = new Date(end);
        maxDate.setDate(end.getDate() + 3);

        return {
            min: minDate.toISOString().split('T')[0],
            max: maxDate.toISOString().split('T')[0]
        };
    };

    const { min: minPayment, max: maxPayment } = getPaymentDateRange();
    const getSelectedTypeDetails = () => periodTypes.find(t => t.id === selectedType);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] w-full max-w-4xl h-[65vh] shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300 overflow-hidden">

                {/* Unified Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Crear Nuevo Periodo</h2>
                            <p className="text-sm text-slate-500 font-medium">Configura la frecuencia y fechas de pago</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel: Type Selection (1/3) */}
                    <div className="w-1/3 border-r border-slate-100 p-6 overflow-y-auto bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Frecuencia</h3>

                        <div className="space-y-3">
                            {periodTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleSelect(type.id)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-2xl border transition-all duration-200 group relative overflow-hidden flex items-center gap-4",
                                        selectedType === type.id
                                            ? "bg-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10 ring-1 ring-[var(--primary)]/20"
                                            : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md text-slate-600"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                                        selectedType === type.id ? type.color : "bg-slate-100 text-slate-400 group-hover:bg-slate-200",
                                        selectedType === type.id && "text-white shadow-sm"
                                    )}>
                                        <type.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={cn(
                                            "font-bold transition-colors",
                                            selectedType === type.id ? "text-[var(--primary)]" : "text-slate-700"
                                        )}>
                                            {type.title}
                                        </h3>
                                        {selectedType === type.id && (
                                            <p className="text-xs text-[var(--primary)]/80 font-medium animate-in fade-in">
                                                {type.days > 0 ? `${type.days} días` : "Variable"}
                                            </p>
                                        )}
                                    </div>
                                    {selectedType === type.id && (
                                        <div className="w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center animate-in zoom-in shrink-0">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Configuration (2/3) */}
                    <div className="w-2/3 p-8 bg-white overflow-y-auto flex flex-col relative">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full pointer-events-none -z-10" />

                        {selectedType ? (
                            <div className="max-w-xl mx-auto w-full h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-5 mb-8 pb-6 border-b border-slate-100">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
                                        getSelectedTypeDetails()?.color
                                    )}>
                                        {getSelectedTypeDetails() && (() => {
                                            const Icon = getSelectedTypeDetails()!.icon;
                                            return <Icon className="w-7 h-7" />;
                                        })()}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-800">
                                            Configurar {getSelectedTypeDetails()?.title}
                                        </h1>
                                        <p className="text-slate-500 font-medium text-sm">
                                            {getSelectedTypeDetails()?.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Fecha de Inicio</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={handleDateChange}
                                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all placeholder:text-slate-400"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">
                                                {getSelectedTypeDetails()?.days ? "Fecha de Fin (Auto)" : "Fecha de Fin"}
                                            </label>
                                            {getSelectedTypeDetails()?.days ? (
                                                <div className="w-full h-12 px-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center text-slate-500 font-medium select-none cursor-not-allowed">
                                                    {endDate || "--/--/----"}
                                                </div>
                                            ) : (
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    min={startDate}
                                                    onChange={handleEndDateChange}
                                                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Fecha de Pago</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={paymentDate}
                                                onChange={handlePaymentDateChange}
                                                min={minPayment}
                                                max={maxPayment}
                                                disabled={!endDate}
                                                className={cn(
                                                    "w-full h-12 px-4 rounded-xl border font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]",
                                                    !endDate ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-50 border-slate-200 text-slate-800"
                                                )}
                                            />
                                            {endDate && (
                                                <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none">
                                                    {paymentDate && <Check className="w-4 h-4 text-emerald-500" />}
                                                </div>
                                            )}
                                        </div>
                                        {endDate && (
                                            <p className="text-[11px] font-bold text-[var(--primary)] ml-1 flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                Rango permitido: {minPayment} al {maxPayment}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={async () => {
                                        setIsLoading(true);
                                        try {
                                            const result = await createPeriod({
                                                startDate,
                                                endDate,
                                                paymentDate,
                                                type: selectedType as any
                                            });

                                            if (result.success) {
                                                onSuccess?.();
                                                onClose();
                                                // Reset state
                                                setSelectedType(null);
                                                setStartDate("");
                                                setEndDate("");
                                                setPaymentDate("");
                                            } else {
                                                alert("Error al crear el periodo");
                                            }
                                        } catch (error) {
                                            console.error(error);
                                            alert("Ocurrió un error inesperado");
                                        } finally {
                                            setIsLoading(false);
                                        }
                                    }}
                                    disabled={!startDate || !endDate || !paymentDate || isLoading}
                                    className="w-full h-14 mt-8 rounded-2xl bg-[var(--primary)] text-white font-bold text-lg shadow-xl shadow-[var(--primary)]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none translate-y-0 disabled:translate-y-0 hover:-translate-y-1"
                                >
                                    {isLoading ? (
                                        <Clock className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <Check className="w-6 h-6" />
                                    )}
                                    {isLoading ? "Guardando..." : "Guardar Periodo"}
                                </button>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                                    <Calendar className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Configura tu Periodo</h3>
                                <p className="text-slate-500 max-w-xs text-lg font-medium">
                                    &larr; Selecciona una opción del menú izquierdo
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
