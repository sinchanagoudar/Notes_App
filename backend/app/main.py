from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, notes
from app.database import database

app = FastAPI(title="Notes API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(notes.router)

@app.get("/")
async def root():
    return {"message": "Notes API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}