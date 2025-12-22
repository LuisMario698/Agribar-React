export default function Home() {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Panel de Control</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium z-10">Total Empleados</h3>
            <p className="text-4xl font-bold text-slate-800 z-10">24</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden">

            <h3 className="text-slate-500 text-sm font-medium z-10">Nómina Activa</h3>
            <p className="text-4xl font-bold text-slate-800 z-10">$145k</p>
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: 'var(--primary)' }}></div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
            <h3 className="text-slate-500 text-sm font-medium">Cuadrillas Activas</h3>
            <p className="text-4xl font-bold text-slate-800">3</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
            <h3 className="text-slate-500 text-sm font-medium">Próximo Pago</h3>
            <p className="text-xl font-bold text-slate-800">15 Dic 2024</p>
            <span className="text-xs text-slate-400">Faltan 2 días</span>
          </div>
        </div>
      </div>

      {/* UI Elements Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Table Showcase */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Empleados Recientes</h3>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-fg)' }}
            >
              Ver Todos
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="pb-3 pl-2">Nombre</th>
                  <th className="pb-3">Puesto</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3 text-right">Salario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { name: "Juan Pérez", role: "Supervisor", status: "Activo", salary: "$12,500" },
                  { name: "Maria Garcia", role: "Capturista", status: "Activo", salary: "$8,500" },
                  { name: "Pedro Lopez", role: "Operador", status: "Vacaciones", salary: "$9,200" },
                ].map((emp, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-3 pl-2 font-medium text-slate-700">{emp.name}</td>
                    <td className="py-3 text-slate-500">{emp.role}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-600 font-mono">{emp.salary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forms & Inputs Showcase */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Registro Rápido</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Nombre</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all" placeholder="Ej. Ana" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Apellido</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all" placeholder="Ej. Lopez" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Departamento</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all">
                  <option>Seleccionar...</option>
                  <option>Administración</option>
                  <option>Campo</option>
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  className="flex-1 py-2 rounded-lg text-sm font-semibold shadow-sm transition-transform active:scale-95"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-fg)' }}
                >
                  Guardar Registro
                </button>
                <button className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">
                  Cancelar
                </button>
              </div>
            </div>
          </div>

          {/* Alerts / States */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Acción Requerida</h4>
              <p className="text-xs text-slate-500">Hay 2 incidencias pendientes de revisar.</p>
            </div>
            <button className="ml-auto text-xs font-bold text-slate-400 hover:text-slate-600">IGNORAR</button>
          </div>
        </div>
      </div>
    </div>
  );
}
