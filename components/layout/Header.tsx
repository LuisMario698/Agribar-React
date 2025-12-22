import { Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
    onMenuClick: () => void;
    isSidebarCollapsed: boolean;
}

export function Header({ onMenuClick, isSidebarCollapsed }: HeaderProps) {
    return (
        <header
            className={cn(
                "h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-0 z-10 transition-all duration-300",
                isSidebarCollapsed ? "md:left-20" : "md:left-72"
            )}
        >
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="p-2 md:hidden hover:bg-slate-100 rounded-lg">
                    <Menu className="w-5 h-5 text-slate-600" />
                </button>
                <h2 className="text-lg font-semibold text-slate-800">Bienvenido</h2>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
            </div>
        </header>
    );
}
