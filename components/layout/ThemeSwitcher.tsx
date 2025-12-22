"use client";

import { useState, useEffect } from "react";
import { Palette } from "lucide-react";

export function ThemeSwitcher() {
    const [theme, setTheme] = useState("brand");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const themes = [
        { id: "brand", name: "Corporativo (Logo)", color: "#77b407" },
    ];

    return (
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <Palette className="w-4 h-4 text-slate-500 ml-2" />
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${theme === t.id ? "border-slate-800 scale-110" : "border-transparent"
                        }`}
                    style={{ backgroundColor: t.color }}
                    title={t.name}
                />
            ))}
        </div>
    );
}
