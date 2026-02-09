from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

from .api.routes_upload import router as upload_router
from .api.routes_images import router as images_router
from .api.routes_auth import router as auth_router
from .middleware.auth_middleware import AuthMiddleware


app = FastAPI()


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication middleware (protects API routes)
app.add_middleware(AuthMiddleware)

# Include routers
app.include_router(auth_router)  # Auth routes (no /api prefix)
app.include_router(upload_router)
app.include_router(images_router)


@app.get("/")
def read_root():
    return {"message": "Euclid Pretty Pics Portal API"}
