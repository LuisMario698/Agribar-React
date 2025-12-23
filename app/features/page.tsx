import { Rocket, Star, Code, Cpu, Shield, Zap, Sparkles, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function FeaturesPage() {
    const features = [
        {
            title: "Gestión de Periodos de Nómina",
            description: "Control total de semanas de pago, apertura y cierre de periodos para el cálculo exacto de nómina.",
            icon: Calendar,
            status: "planned",
            eta: "Próximamente",
            href: "/features/periodos" // Link added
        },
        {
            title: "Reportes Avanzados",
            description: "Generación de PDFs, gráficas de rendimiento por cuadrilla y exportación a Excel.",
            icon: Star,
            status: "planned",
            eta: "Q1 2026"
        },
        {
            title: "Control de Asistencia Biométrico",
            description: "Integración con dispositivos de huella digital para el pase de lista automático.",
            icon: Shield,
            status: "future",
            eta: "Pendiente"
        },
        {
            title: "Pagos Masivos",
            description: "Conexión directa con API bancaria para dispersión de nómina en un clic.",
            icon: Zap,
            status: "future",
            eta: "Pendiente"
        },
        {
            title: "IA Predicitiva",
            description: "Análisis de datos para predecir necesidades de personal según temporada.",
            icon: Cpu,
            status: "future",
            eta: "Futuro Lejano"
        },
    ];
    // Return statement needs to handle the rendering logic inside the map

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto pb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Roadmap de Funcionalidades</h1>
                    </div>
                    <p className="text-indigo-100 max-w-xl text-lg font-medium">
                        Explora las próximas innovaciones y módulos que llevarán la gestión agrícola al siguiente nivel.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, idx) => {
                    const CardContent = (
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 h-full cursor-pointer relative overflow-hidden">
                            {feature.href && (
                                <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/30 transition-colors z-0" />
                            )}
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300",
                                        feature.status === "planned" ? "bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white" :
                                            "bg-slate-50 text-slate-400 group-hover:bg-slate-800 group-hover:text-white"
                                    )}>
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide",
                                        feature.status === "planned" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                                    )}>
                                        {feature.status === "planned" ? "Planeado" : "Futuro"}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[var(--primary)] transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    {feature.description}
                                </p>

                                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <Sparkles className="w-4 h-4" />
                                    <span>ETA: {feature.eta}</span>
                                </div>
                            </div>
                        </div>
                    );

                    return (feature as any).href ? (
                        <Link key={idx} href={(feature as any).href}>
                            {CardContent}
                        </Link>
                    ) : (
                        <div key={idx}>{CardContent}</div>
                    );
                })}

                {/* Empty State / Call to Action */}
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center group hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Code className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">¿Tienes una idea?</h3>
                    <p className="text-slate-500 text-sm max-w-xs">
                        Si necesitas una funcionalidad específica, agrégala aquí para su desarrollo.
                    </p>
                </div>
            </div>
        </div>
    );
}
