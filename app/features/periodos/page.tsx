"use client";

import { useState } from "react";
import { ChevronLeft, Calendar, User, Clock, Check, Sparkles, Hash, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PeriodosPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [paymentDate, setPaymentDate] = useState("");

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

    const handleConfirmSelection = () => {
        if (selectedType) setStep(2);
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
            }
        } else {
            setEndDate(""); // Clear end date if start date is empty
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };

    const getSelectedTypeDetails = () => periodTypes.find(t => t.id === selectedType);

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => step === 2 ? setStep(1) : router.push("/features")}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {step === 1 ? "Tipo de Periodo" : `Configurar ${getSelectedTypeDetails()?.title}`}
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {step === 1 ? "Selecciona la frecuencia con la que se calculará la nómina" : "Define las fechas del primer periodo"}
                    </p>
                </div>
            </div>

            {step === 1 ? (
                <>
                    {/* Step 1: Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {periodTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => handleSelect(type.id)}
                                className={cn(
                                    "relative text-left p-8 rounded-[2rem] border transition-all duration-300 group flex flex-col h-full",
                                    selectedType === type.id
                                        ? "bg-white border-[var(--primary)] shadow-xl ring-2 ring-[var(--primary)]/20 scale-[1.02]"
                                        : "bg-white border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-slate-200"
                                )}
                            >
                                {selectedType === type.id && (
                                    <div className="absolute top-6 right-6 w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center animate-in zoom-in">
                                        <Check className="w-5 h-5 text-white" />
                                    </div>
                                )}

                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors shadow-lg",
                                    type.color,
                                    "text-white shadow-current/20"
                                )}>
                                    <type.icon className="w-8 h-8" />
                                </div>

                                <h3 className={cn(
                                    "text-xl font-bold mb-3 transition-colors",
                                    selectedType === type.id ? "text-[var(--primary)]" : "text-slate-800"
                                )}>
                                    {type.title}
                                </h3>

                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {type.description}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Footer Action */}
                    <div className={cn(
                        "fixed bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out z-50",
                        selectedType ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                    )}>
                        <button
                            onClick={handleConfirmSelection}
                            className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-transform"
                        >
                            Confirmar Selección
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </>
            ) : (
                /* Step 2: Date Configuration */
                <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 animate-in slide-in-from-right-8 duration-500">
                    <div className="flex items-center gap-6 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg",
                            getSelectedTypeDetails()?.color
                        )}>
                            {getSelectedTypeDetails() && (() => {
                                const Icon = getSelectedTypeDetails()!.icon;
                                return <Icon className="w-8 h-8" />;
                            })()}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Periodo {getSelectedTypeDetails()?.title}</h3>
                            <p className="text-slate-500">
                                {getSelectedTypeDetails()?.days ? `Duración: ${getSelectedTypeDetails()?.days} días` : "Duración variable"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-500 ml-2">Fecha de Inicio</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={handleDateChange}
                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-500 ml-2">
                                {getSelectedTypeDetails()?.days ? "Fecha de Fin (Automática)" : "Fecha de Fin"}
                            </label>
                            {getSelectedTypeDetails()?.days ? (
                                <div className="w-full h-14 px-6 rounded-2xl bg-slate-100 border border-slate-200 flex items-center text-lg font-bold text-slate-500 select-none">
                                    {endDate || "--/--/----"}
                                </div>
                            ) : (
                                <input
                                    type="date"
                                    value={endDate}
                                    min={startDate}
                                    onChange={handleEndDateChange}
                                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                                />
                            )}
                        </div>

                        {/* Payment Date Input */}
                        <div className="col-span-1 md:col-span-2 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
                            <label className="text-sm font-bold text-slate-500 ml-2">Fecha de Pago</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={paymentDate}
                                    onChange={handlePaymentDateChange}
                                    min={minPayment}
                                    max={maxPayment}
                                    disabled={!endDate}
                                    className={cn(
                                        "w-full h-14 px-6 rounded-2xl border text-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]",
                                        !endDate ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-50 border-slate-200 text-slate-800"
                                    )}
                                />
                                {endDate && (
                                    <p className="absolute -bottom-6 left-2 text-xs font-medium text-slate-400">
                                        Rango permitido: {minPayment} al {maxPayment}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-4">
                        <button
                            className="w-full h-14 rounded-2xl bg-[var(--primary)] text-white font-bold text-lg shadow-lg shadow-[var(--primary)]/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            <Check className="w-6 h-6" />
                            Guardar Periodo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
