"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Users, Calculator, Settings, X, LogOut, ChevronRight, PanelLeft, Layers, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Users, label: "Empleados", href: "/empleados" },
    { icon: Briefcase, label: "Actividades", href: "/actividades" },
    { icon: Layers, label: "Cuadrillas", href: "/cuadrillas" },
    { icon: Calculator, label: "Nómina", href: "/nomina" },
    { icon: Settings, label: "Configuración", href: "/settings" },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed?: boolean;
    toggleCollapse?: () => void;
}

export function Sidebar({ isOpen, onClose, isCollapsed, toggleCollapse }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside
                className={cn(
                    "h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-2xl",
                    "bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)]",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    isCollapsed ? "w-20" : "w-72"
                )}
            >
                {/* Decorative Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                {/* Logo Section */}
                <div className={cn("relative z-10 flex justify-center transition-all duration-300", isCollapsed ? "p-4" : "p-4")}>
                    <div className="relative group">
                        <div className={cn(
                            "bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 ring-1 ring-black/5 transition-all duration-300",
                            isCollapsed ? "p-2" : "px-4 py-2"
                        )}>
                            <div className={cn("relative transition-all duration-300", isCollapsed ? "w-10 h-10" : "w-60 h-20")}>
                                <Image
                                    src={isCollapsed ? "/logo_sin.png" : "/logo.png"}
                                    alt="Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-2 py-4 relative z-10 overflow-y-auto overflow-x-hidden">
                    {!isCollapsed && (
                        <p className="px-4 text-xs font-bold opacity-40 uppercase tracking-widest mb-2 whitespace-nowrap">
                            Menu Principal
                        </p>
                    )}
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-4 py-3.5 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-white text-[var(--sidebar-bg)] shadow-lg font-semibold"
                                        : "hover:bg-white/10 text-[var(--sidebar-fg)]/80 hover:text-white",
                                    isCollapsed ? "justify-center" : "justify-between"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("min-w-5 w-5 h-5", isActive ? "text-[var(--sidebar-bg)]" : "opacity-70")} />
                                    {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                                </div>
                                {isActive && !isCollapsed && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse Toggle (Desktop Only) */}
                <div className="hidden md:block px-4 pb-2 relative z-10">
                    <button
                        onClick={toggleCollapse}
                        className={cn(
                            "w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group",
                            "hover:bg-white/10 text-[var(--sidebar-fg)]/80 hover:text-white",
                            isCollapsed ? "justify-center" : "justify-between"
                        )}
                        title={isCollapsed ? "Expandir" : "Colapsar"}
                    >
                        <div className="flex items-center gap-3">
                            <PanelLeft className={cn("min-w-5 w-5 h-5", isCollapsed ? "opacity-100" : "opacity-70 group-hover:opacity-100")} />
                            {!isCollapsed && <span className="whitespace-nowrap font-medium">Colapsar menú</span>}
                        </div>
                        {!isCollapsed && <ChevronRight className="w-4 h-4 rotate-180 opacity-70 group-hover:opacity-100" />}
                    </button>
                </div>

                {/* Profile Footer */}
                <div className="p-4 relative z-10 pt-0">
                    <div className={cn(
                        "bg-black/20 rounded-2xl backdrop-blur-sm border border-white/5 transition-all duration-300",
                        isCollapsed ? "p-2" : "p-4"
                    )}>
                        <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center mb-0" : "mb-3")}>
                            <div
                                className="min-w-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md border-2 border-white/20"
                                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-fg)' }}
                            >
                                AD
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0 transition-opacity duration-300">
                                    <p className="font-semibold text-sm truncate">Admin User</p>
                                    <p className="text-xs opacity-50 truncate">admin@agr.com</p>
                                </div>
                            )}
                        </div>
                        {!isCollapsed && (
                            <button className="w-full flex items-center justify-center gap-2 text-xs font-medium py-2 rounded-lg hover:bg-white/10 transition-colors opacity-70 hover:opacity-100 whitespace-nowrap">
                                <LogOut className="w-3.5 h-3.5" />
                                Cerrar Sesión
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
