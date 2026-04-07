from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Date, ForeignKey
from sqlalchemy.sql import func
from database import Base

# 1. Tabla de Usuarios (Indispensable para el Login) [cite: 104]
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="analista")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

# 2. Tabla de Servicios (Para la inteligencia de tus CSV) [cite: 108]
class HospitalService(Base):
    __tablename__ = "hospital_services"

    id = Column(Integer, primary_key=True, index=True)
    
    # Columnas mapeadas de tus archivos CSV/Excel [cite: 108]
    fecha = Column(Date, nullable=False)
    area = Column(String(100), nullable=False)
    pacientes = Column(Integer, default=0)
    camas_ocupadas = Column(Integer, default=0)
    tiempo_atencion = Column(Integer, default=0)
    estado = Column(String(50)) # normal, alto, critico [cite: 108]
    
    # Relación con el usuario que subió la información [cite: 104]
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())