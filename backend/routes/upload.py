from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import pandas as pd
import io

router = APIRouter()

@router.post("/upload/csv")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="Solo CSV o Excel")
    
    contents = await file.read()
    
    try:
        if file.filename.endswith('.csv'):
            try:
                df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
            except UnicodeDecodeError:
                df = pd.read_csv(io.StringIO(contents.decode('latin-1')))
        else:
            df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error leyendo archivo: {str(e)}")

    # Procesar datos
    summary = {
        "total_rows": len(df),
        "columns": df.columns.tolist(),
        "kpis": {}
    }

    # KPIs automáticos según columnas detectadas
    if 'pacientes' in df.columns:
        summary["kpis"]["total_pacientes"] = int(df['pacientes'].sum())
        summary["kpis"]["promedio_pacientes"] = round(float(df['pacientes'].mean()), 1)

    if 'camas_ocupadas' in df.columns:
        summary["kpis"]["max_camas"] = int(df['camas_ocupadas'].max())
        summary["kpis"]["promedio_camas"] = round(float(df['camas_ocupadas'].mean()), 1)

    if 'tiempo_atencion' in df.columns:
        summary["kpis"]["tiempo_promedio"] = round(float(df['tiempo_atencion'].mean()), 1)

    # Datos para gráficos
    chart_data = []
    if 'area' in df.columns and 'pacientes' in df.columns:
        chart_data = df.groupby('area')['pacientes'].sum().reset_index()
        chart_data = chart_data.rename(columns={'area': 'area', 'pacientes': 'atenciones'})
        chart_data = chart_data.to_dict('records')

    line_data = []
    if 'fecha' in df.columns and 'pacientes' in df.columns:
        df['fecha'] = pd.to_datetime(df['fecha'])
        df['mes'] = df['fecha'].dt.strftime('%b')
        line_data = df.groupby('mes')['pacientes'].sum().reset_index()
        line_data = line_data.to_dict('records')

    return {
        "success": True,
        "filename": file.filename,
        "summary": summary,
        "chart_data": chart_data,
        "line_data": line_data
    }