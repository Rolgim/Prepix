from fastapi import APIRouter
from ..services.storage import list_files


router = APIRouter()


@router.get("/images")
def get_images():
    return list_files()