import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Upload, FileText, LogOut, TrendingUp, Users, Activity, AlertTriangle } from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

const defaultKPIs = [
  { label: 'Camas Ocupadas', value: '847', unit: '/1200', trend: '+5%', color: 'blue', icon: Activity },
  { label: 'Pacientes Atendidos', value: '1,234', unit: 'hoy', trend: '+12%', color: 'green', icon: Users },
  { label: 'Tiempo Promedio', value: '28', unit: 'min', trend: '-8%', color: 'yellow', icon: TrendingUp },
  { label: 'Alertas Activas', value: '3', unit: 'críticas', trend: '+1', color: 'red', icon: AlertTriangle },
]

const defaultLine = [
  { mes: 'Ene', pacientes: 980 },
  { mes: 'Feb', pacientes: 1100 },
  { mes: 'Mar', pacientes: 1050 },
  { mes: 'Abr', pacientes: 1234 },
  { mes: 'May', pacientes: 1180 },
  { mes: 'Jun', pacientes: 1320 },
]

const defaultBar = [
  { area: 'Emergencia', atenciones: 420 },
  { area: 'Consulta', atenciones: 380 },
  { area: 'UCI', atenciones: 95 },
  { area: 'Cirugía', atenciones: 210 },
  { area: 'Pediatría', atenciones: 129 },
]

const mockPie = [
  { name: 'Alta médica', value: 62 },
  { name: 'En tratamiento', value: 25 },
  { name: 'Observación', value: 10 },
  { name: 'Crítico', value: 3 },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: 'Administrador' })
  const [kpis, setKpis] = useState(defaultKPIs)
  const [barData, setBarData] = useState(defaultBar)
  const [lineData, setLineData] = useState(defaultLine)
  const [csvLoaded, setCsvLoaded] = useState(false)

 useEffect(() => {
  const stored = localStorage.getItem('user');
  if (stored) setUser(JSON.parse(stored));

  const dashData = localStorage.getItem('dashboardData');
  if (dashData) {
    const parsed = JSON.parse(dashData);

    // 1. Datos para el gráfico de barras (ya viene como 'area' y 'atenciones')
    if (parsed.chart_data?.length > 0) {
      setBarData(parsed.chart_data);
    }

    // 2. Datos para el gráfico de líneas (ya viene como 'mes' y 'pacientes')
    if (parsed.line_data?.length > 0) {
      setLineData(parsed.line_data);
    }

    // 3. Mapeo inteligente de los 4 cuadros de arriba (KPIs)
    if (parsed.summary?.kpis) {
      const k = parsed.summary.kpis;
      setKpis([
        { 
          label: 'Camas Ocupadas', 
          value: k.promedio_camas?.toFixed(1) || '0', 
          unit: 'promedio', 
          trend: 'Dato real', 
          color: 'blue', 
          icon: Activity 
        },
        { 
          label: 'Pacientes Atendidos', 
          value: k.total_pacientes?.toLocaleString() || '0', 
          unit: 'total', 
          trend: '+12%', 
          color: 'green', 
          icon: Users 
        },
        { 
          label: 'Tiempo Promedio', 
          value: k.tiempo_promedio?.toString() || '0', 
          unit: 'min', 
          trend: 'Dato real', 
          color: 'yellow', 
          icon: TrendingUp 
        },
        { 
          label: 'Alertas Activas', 
          value: k.max_camas?.toString() || '0', 
          unit: 'pico camas', 
          trend: 'Máximo', 
          color: 'red', 
          icon: AlertTriangle 
        },
      ]);
    }

    setCsvLoaded(true);
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('dashboardData')
    navigate('/login')
  }

  const handleClearData = () => {
    localStorage.removeItem('dashboardData')
    setKpis(defaultKPIs)
    setBarData(defaultBar)
    setLineData(defaultLine)
    setCsvLoaded(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">DP</span>
          </div>
          <span className="font-bold text-gray-800 text-lg">DataPulse</span>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">Salud</span>
          {csvLoaded && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium flex items-center gap-1">
              ✅ Datos CSV cargados
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {csvLoaded && (
            <button onClick={handleClearData} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
              Limpiar datos
            </button>
          )}
          <button onClick={() => navigate('/upload')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Upload size={16} /> Subir datos
          </button>
          <button onClick={() => navigate('/reports')} className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <FileText size={16} /> Reportes
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-medium text-gray-700">
              {user.name?.[0] || 'A'}
            </div>
            {user.name}
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard General</h1>
          <p className="text-gray-500 text-sm mt-1">
            {csvLoaded ? '✅ Mostrando datos de tu archivo CSV' : 'Indicadores en tiempo real — Actualizado hace 5 min'}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon
            const colors = {
              blue: 'bg-blue-50 text-blue-600',
              green: 'bg-green-50 text-green-600',
              yellow: 'bg-yellow-50 text-yellow-600',
              red: 'bg-red-50 text-red-600',
            }
            return (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500 font-medium">{kpi.label}</span>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[kpi.color]}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-gray-800">{kpi.value}</span>
                  <span className="text-sm text-gray-400 mb-1">{kpi.unit}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Tendencia: <span className="font-medium text-gray-600">{kpi.trend}</span></p>
              </div>
            )
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Line Chart */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Pacientes atendidos — 2024</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="pacientes" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Atenciones por área</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="area" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="atenciones" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Estado de pacientes</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={mockPie} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                  {mockPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {mockPie.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Alertas activas</h3>
            <div className="space-y-3">
              {[
                { msg: 'UCI al 95% de capacidad', level: 'Crítico', color: 'red' },
                { msg: 'Tiempo de espera Emergencia supera 45 min', level: 'Alto', color: 'yellow' },
                { msg: 'Stock de medicamentos tipo B bajo', level: 'Medio', color: 'blue' },
              ].map((alert, i) => {
                const colors = { red: 'bg-red-50 border-red-200 text-red-700', yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700', blue: 'bg-blue-50 border-blue-200 text-blue-700' }
                return (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${colors[alert.color]}`}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} />
                      <span className="text-sm font-medium">{alert.msg}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-white bg-opacity-60">{alert.level}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}