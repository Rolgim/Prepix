from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes_upload import router as upload_router
from .api.routes_images import router as images_router
from .database.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Prepix API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, tags=["upload"])
app.include_router(images_router, tags=["images"])


@app.get("/")
def read_root():
    return {"message": "Prepix API is running"}