import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes_upload import router as upload_router
from .api.routes_images import router as images_router
from .database.database import engine, Base
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded


Base.metadata.create_all(bind=engine)

TESTING = os.environ.get("TESTING") == "1"
if TESTING:
    limiter = Limiter(key_func=lambda: "test")
else:
    limiter = Limiter(key_func=get_remote_address, default_limits=["1/minute"])

app = FastAPI(title="Prepix API")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

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