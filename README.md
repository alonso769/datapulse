# 🏥 DataPulse — Plataforma SaaS de Análisis de Indicadores de Salud

![DataPulse](https://img.shields.io/badge/Status-En%20desarrollo-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss)

## 📊 ¿Qué es DataPulse?

DataPulse es una solución SaaS (Software as a Service) diseñada para digitalizar y automatizar el análisis de indicadores operacionales en instituciones de salud. La plataforma permite transformar archivos CSV o Excel en dashboards interactivos con KPIs críticos en tiempo real.Este proyecto surge de la experiencia directa en la DIRIS Lima Centro y el Hospital Santa Rosa, atendiendo la necesidad crítica de herramientas modernas de visualización para la gestión hospitalaria.

## ✨ Funcionalidades

- 📈 Dashboard con KPIs en tiempo real
- 📁 Carga de archivos CSV y Excel
- 🔔 Alertas automáticas por umbrales críticos
- 📄 Generación de reportes PDF
- 👥 Autenticación con roles (admin, analista)
- ☁️ Persistencia en la Nube

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite + TailwindCSS |
| Gráficos | Recharts |
| Backend | Python + FastAPI |
| Base de datos | Azure SQL / PostgreSQL |
| Auth | JWT |
| Deploy | Vercel + Render |

## 🚀 Correr localmente

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📸 Screenshots

> Dashboard principal con KPIs, gráficos y alertas en tiempo real

## 👨‍💻 Autor

**Alonso Sixto Silva Vidal**  
Data Analyst & BI Engineer  
[LinkedIn](https://www.linkedin.com/in/alonso-sixto-silva) · [Portafolio](https://alonso769.github.io/PORTAFOLIO/)

## 🌐 Demo en vivo
👉 **[datapulse-indol.vercel.app](https://datapulse-indol.vercel.app)**

**Credenciales demo:**
- Email: `asilva@datapulse.com`
- Password: `ClaveSegura2026*`