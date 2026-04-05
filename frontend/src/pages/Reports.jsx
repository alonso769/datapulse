import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, FileText, Calendar, Filter } from 'lucide-react'

const mockReports = [
  { id: 1, name: 'Reporte Mensual — Marzo 2024', area: 'General', date: '01/04/2024', status: 'Listo', size: '2.4 MB' },
  { id: 2, name: 'KPIs Emergencia — Q1 2024', area: 'Emergencia', date: '28/03/2024', status: 'Listo', size: '1.8 MB' },
  { id: 3, name: 'Análisis UCI — Febrero 2024', area: 'UCI', date: '01/03/2024', status: 'Listo', size: '980 KB' },
  { id: 4, name: 'Reporte Mensual — Febrero 2024', area: 'General', date: '01/03/2024', status: 'Listo', size: '2.1 MB' },
  { id: 5, name: 'Indicadores Pediatría — Enero 2024', area: 'Pediatría', date: '01/02/2024', status: 'Listo', size: '750 KB' },
]

const areas = ['Todas', 'General', 'Emergencia', 'UCI', 'Pediatría', 'Cirugía']

export default function Reports() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('Todas')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const filtered = filter === 'Todas' ? mockReports : mockReports.filter(r => r.area === filter)

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setGenerating(false)
    setGenerated(true)
    setTimeout(() => setGenerated(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Volver al Dashboard</span>
        </button>
        <div className="w-px h-5 bg-gray-200"></div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">DP</span>
          </div>
          <span className="font-bold text-gray-800">DataPulse</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
            <p className="text-gray-500 text-sm mt-1">Genera y descarga reportes en PDF</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generando...
              </>
            ) : generated ? (
              <>✅ ¡Generado!</>
            ) : (
              <>
                <FileText size={16} />
                Generar nuevo reporte
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter size={15} />
              <span className="font-medium">Filtrar por área:</span>
            </div>
            {areas.map(area => (
              <button
                key={area}
                onClick={() => setFilter(area)}
                className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filter === area
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="col-span-5">Nombre</span>
            <span className="col-span-2">Área</span>
            <span className="col-span-2">Fecha</span>
            <span className="col-span-1">Tamaño</span>
            <span className="col-span-2 text-right">Acción</span>
          </div>

          {filtered.map((report, i) => (
            <div key={report.id} className={`grid grid-cols-12 items-center px-5 py-4 ${i !== filtered.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 transition-colors`}>
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={15} className="text-red-500" />
                </div>
                <span className="text-sm font-medium text-gray-800 truncate">{report.name}</span>
              </div>
              <div className="col-span-2">
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">{report.area}</span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar size={13} />
                {report.date}
              </div>
              <div className="col-span-1 text-xs text-gray-400">{report.size}</div>
              <div className="col-span-2 flex justify-end">
                <button className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                  <Download size={15} />
                  Descargar
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <FileText size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay reportes para esta área</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}