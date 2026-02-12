from fastapi import APIRouter
from ..services.storage import list_files
from ..models.schemas import ImageMetadataResponse

router = APIRouter()


@router.get("/images", response_model=list[ImageMetadataResponse])
def get_images():
    """
    Get a list of all uploaded images along with their metadata.
    
    Returns:
        A list of ImageMetadataResponse objects containing metadata for each uploaded image.
    """
    return list_files()