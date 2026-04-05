# 🏥 DataPulse — Plataforma SaaS de Análisis de Indicadores de Salud

![DataPulse](https://img.shields.io/badge/Status-En%20desarrollo-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss)

## 📊 ¿Qué es DataPulse?

SaaS de análisis de datos para hospitales y clínicas. Permite subir archivos CSV/Excel y genera automáticamente dashboards interactivos con KPIs, alertas y reportes PDF.

## ✨ Funcionalidades

- 📈 Dashboard con KPIs en tiempo real
- 📁 Carga de archivos CSV y Excel
- 🔔 Alertas automáticas por umbrales críticos
- 📄 Generación de reportes PDF
- 👥 Autenticación con roles (admin, analista)
- 🗄️ Base de datos PostgreSQL

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite + TailwindCSS |
| Gráficos | Recharts |
| Backend | Python + FastAPI |
| Base de datos | PostgreSQL |
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