import { Users, UserPlus, Search, ChevronDown, Check } from "lucide-react";

import { CuadrillaOrganizerModal } from "./CuadrillaOrganizerModal";
import { useState, useRef, useEffect } from "react";

import { getCuadrillas } from "@/lib/actions/cuadrillas";

interface CuadrillaSelectorProps {
    selectedId?: string;
    onSelect?: (id: string) => void;
}

export function CuadrillaSelector({ selectedId, onSelect }: CuadrillaSelectorProps) {
    const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);
    const [cuadrillas, setCuadrillas] = useState<any[]>([]);
    const [internalSelectedId, setInternalSelectedId] = useState<string>("");

    // Use prop if available, otherwise internal state
    const currentSelectedId = selectedId !== undefined ? selectedId : internalSelectedId;

    // Search/Autocomplete states
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getCuadrillas().then((result) => {
            if (result.success && result.data) {
                setCuadrillas(result.data);
            }
        });
    }, [isOrganizerOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter cuadrillas
    const filteredCuadrillas = cuadrillas.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (cuadrilla: any) => {
        if (onSelect) {
            onSelect(cuadrilla.id.toString());
        } else {
            setInternalSelectedId(cuadrilla.id.toString());
        }
        setSearchTerm(cuadrilla.nombre);
        setIsDropdownOpen(false);
    };

    return (
        <>
            <div className="bg-white rounded-[2rem] p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4 h-full">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-slate-700">Cuadrilla</span>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                    <div className="relative flex-1 max-w-[280px]" ref={wrapperRef}>
                        <div
                            className="bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 cursor-text"
                            onClick={() => setIsDropdownOpen(true)}
                        >
                            <Search className="w-4 h-4 text-slate-400 ml-1" />
                            <input
                                type="text"
                                placeholder="Buscar cuadrilla..."
                                className="bg-transparent w-full text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsDropdownOpen(true);
                                    if (e.target.value === "") {
                                        if (onSelect) onSelect("");
                                        else setInternalSelectedId("");
                                    }
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                            />
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-2xl max-h-[196px] overflow-y-auto z-50 p-1 ring-1 ring-black/5">
                                {filteredCuadrillas.length > 0 ? (
                                    filteredCuadrillas.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => handleSelect(c)}
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-green-700 flex items-center justify-between group transition-colors"
                                        >
                                            {c.nombre}
                                            {currentSelectedId === c.id.toString() && (
                                                <Check className="w-4 h-4 text-green-600" />
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-4 text-center text-xs text-slate-400">
                                        No se encontraron resultados
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsOrganizerOpen(true)}
                        className="px-3 py-2 bg-white border border-green-200 rounded-xl text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm hover:bg-green-50 transition-colors whitespace-nowrap"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Armar</span>
                    </button>
                </div>
            </div>

            <CuadrillaOrganizerModal
                isOpen={isOrganizerOpen}
                onClose={() => setIsOrganizerOpen(false)}
                initialCuadrillaId={currentSelectedId}
            />
        </>
    );
}
