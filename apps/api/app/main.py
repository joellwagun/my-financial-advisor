from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import ocr

app = FastAPI(
    title="My Financial Advisor API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routers = [
    ocr.router,
]

for router in routers:
    app.include_router(router)


@app.get("/")
def root():
    return {"message": "Financial Advisor API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
