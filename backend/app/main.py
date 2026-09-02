from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app import database
from app.routers import auth, patients, users


@asynccontextmanager
async def lifespan(_app: FastAPI):
    await database.init_db()
    yield


app = FastAPI(title="SmritiYog API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict[str, str]:
    return {"status": "ok", "service": "SmritiYog API"}


@app.get("/health")
async def health() -> dict[str, str]:
    db_status = "ok"
    try:
        async with database.engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        db_status = "error"
    return {"status": "ok", "database": db_status}


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(patients.router)