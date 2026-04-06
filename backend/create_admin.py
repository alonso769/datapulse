from database import SessionLocal
from models import User
from passlib.context import CryptContext

def create_admin():
    db = SessionLocal()
    pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    # Verificar si ya existe
    existing = db.query(User).filter(User.email == "admin@datapulse.com").first()
    if existing:
        print("⚠️ Usuario ya existe!")
        db.close()
        return
    
    admin = User(
        name="Alonso Sixto",
        email="admin@datapulse.com",
        password=pwd.hash("admin123"),
        role="admin"
    )
    
    db.add(admin)
    db.commit()
    print("✅ Usuario admin creado!")
    db.close()

create_admin()