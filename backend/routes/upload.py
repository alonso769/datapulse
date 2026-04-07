from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from utils import intelligent_standardizer # Cerebro de mapeo inteligente
import pandas as pd
import io

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/csv")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Validación de extensión
    if not file.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos CSV o Excel (.xlsx)")
    
    contents = await file.read()
    
    # 2. Lectura flexible de archivos (CSV con detección de encoding o Excel) 
    try:
        if file.filename.endswith('.csv'):
            try:
                # Intenta cargar con UTF-8 primero
                df = pd.read_csv(io.BytesIO(contents), encoding='utf-8')
            except UnicodeDecodeError:
                # Si falla, usa Latin-1 (común en archivos generados por Excel en español)
                df = pd.read_csv(io.BytesIO(contents), encoding='latin-1')
        else:
            # Procesamiento nativo para archivos Excel 
            df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al leer el archivo: {str(e)}")

    # 3. APLICACIÓN DE INTELIGENCIA DE MAPEO 
    # Aquí el sistema busca sinónimos (ej: "Atenciones" -> "pacientes")
    df = intelligent_standardizer(df) 

    # 4. Procesamiento de Resumen y KPIs [cite: 67, 108]
    summary = {
        "total_rows": len(df),
        "detected_columns": df.columns.tolist(),
        "kpis": {
            "total_pacientes": 0,
            "promedio_pacientes": 0,
            "max_camas": 0,
            "promedio_camas": 0,
            "tiempo_promedio": 0
        }
    }

    # Cálculo dinámico basado en columnas estandarizadas [cite: 74, 108]
    if 'pacientes' in df.columns:
        summary["kpis"]["total_pacientes"] = int(df['pacientes'].sum())
        summary["kpis"]["promedio_pacientes"] = round(float(df['pacientes'].mean()), 1)

    if 'camas_ocupadas' in df.columns:
        summary["kpis"]["max_camas"] = int(df['camas_ocupadas'].max())
        summary["kpis"]["promedio_camas"] = round(float(df['camas_ocupadas'].mean()), 1)

    if 'tiempo_atencion' in df.columns:
        summary["kpis"]["tiempo_promedio"] = round(float(df['tiempo_atencion'].mean()), 1)

    # 5. Estructuración de datos para Recharts [cite: 68, 69, 70]
    
    # Gráfico de Barras: Atenciones por Área Hospitalaria [cite: 69]
    chart_data = []
    if 'area' in df.columns and 'pacientes' in df.columns:
        chart_data = df.groupby('area')['pacientes'].sum().reset_index()
        chart_data = chart_data.rename(columns={'pacientes': 'atenciones'})
        chart_data = chart_data.to_dict('records')

    # Gráfico de Líneas: Evolución mensual de pacientes [cite: 68]
    line_data = []
    if 'fecha' in df.columns and 'pacientes' in df.columns:
        # Aseguramos que la columna sea datetime (el estandarizador ya lo intentó)
        df['fecha'] = pd.to_datetime(df['fecha'])
        df['mes'] = df['fecha'].dt.strftime('%b') # Enero -> Jan, etc.
        
        # Agrupamos por mes para ver la tendencia [cite: 68]
        line_data = df.groupby('mes')['pacientes'].sum().reset_index()
        line_data = line_data.to_dict('records')

    # 6. Respuesta final al Frontend
    return {
        "success": True,
        "filename": file.filename,
        "summary": summary,
        "chart_data": chart_data,
        "line_data": line_data
    }