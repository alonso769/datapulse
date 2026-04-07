import pandas as pd

# Diccionario de alias hospitalarios para detección automática [cite: 108]
COLUMN_MAP = {
    "fecha": ["fecha", "fec", "date", "periodo", "día", "mes", "atencion_fec"],
    "area": ["area", "área", "servicio", "unidad", "especialidad", "sede", "departamento"],
    "pacientes": ["pacientes", "atenciones", "atendidos", "total", "cantidad", "nro_pacientes"],
    "camas_ocupadas": ["camas", "ocupación", "camas_ocupadas", "beds", "camas_hosp"],
    "tiempo_atencion": ["tiempo", "duración", "minutos", "espera", "t_atencion"],
    "estado": ["estado", "alerta", "situación", "status", "prioridad"]
}

def intelligent_standardizer(df):
    """Mapea columnas automáticamente y limpia datos [cite: 73, 74]"""
    # Convertir nombres de columnas a minúsculas y limpiar espacios
    df.columns = [col.lower().strip() for col in df.columns]
    
    rename_dict = {}
    for official, aliases in COLUMN_MAP.items():
        for col in df.columns:
            if col in aliases:
                rename_dict[col] = official
                break
    
    # Renombrar solo las columnas encontradas
    df = df.rename(columns=rename_dict)
    
    # Estandarizar fechas para que Azure y SQLAlchemy no fallen [cite: 104, 108]
    if "fecha" in df.columns:
        df["fecha"] = pd.to_datetime(df["fecha"], errors='coerce')
        
    return df