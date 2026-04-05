import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileSpreadsheet, CheckCircle, ArrowLeft, X } from 'lucide-react'

export default function UploadPage() {
  const navigate = useNavigate()
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFile = (f) => {
    if (!f) return
    const allowed = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    if (!allowed.includes(f.type) && !f.name.endsWith('.csv') && !f.name.endsWith('.xlsx')) {
      alert('Solo se permiten archivos CSV o Excel (.xlsx)')
      return
    }
    setFile(f)
    setPreview({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
      type: f.name.endsWith('.csv') ? 'CSV' : 'Excel'
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    // Simula subida — aquí conectarás con FastAPI
    await new Promise(r => setTimeout(r, 2000))
    setUploading(false)
    setSuccess(true)
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

      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Subir datos</h1>
          <p className="text-gray-500 text-sm mt-1">Sube tu archivo CSV o Excel para generar análisis automático</p>
        </div>

        {success ? (
          <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¡Archivo procesado!</h2>
            <p className="text-gray-500 text-sm mb-6">Tu dashboard ha sido actualizado con los nuevos datos.</p>
            <button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Ver Dashboard
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <input
                id="fileInput"
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={e => handleFile(e.target.files[0])}
              />
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload size={24} className="text-blue-500" />
              </div>
              <p className="font-semibold text-gray-700 mb-1">Arrastra tu archivo aquí</p>
              <p className="text-sm text-gray-400">o haz clic para seleccionar</p>
              <p className="text-xs text-gray-300 mt-3">CSV o Excel (.xlsx) — máx. 10MB</p>
            </div>

            {/* Preview */}
            {preview && (
              <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{preview.name}</p>
                    <p className="text-xs text-gray-400">{preview.type} · {preview.size}</p>
                  </div>
                </div>
                <button onClick={() => { setFile(null); setPreview(null) }} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Formato esperado */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-2">Columnas esperadas en tu archivo:</p>
              <div className="flex flex-wrap gap-2">
                {['fecha', 'area', 'pacientes', 'camas_ocupadas', 'tiempo_atencion', 'estado'].map(col => (
                  <span key={col} className="text-xs bg-white text-blue-600 border border-blue-200 px-2 py-1 rounded font-mono">{col}</span>
                ))}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {uploading ? 'Procesando...' : 'Subir y analizar'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}