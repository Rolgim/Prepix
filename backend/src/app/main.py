from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from .api.routes_upload import router as upload_router
from .api.routes_images import router as images_router


app = FastAPI()


app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)


app.include_router(upload_router)
app.include_router(images_router)