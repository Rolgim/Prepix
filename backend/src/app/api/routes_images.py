from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..database import crud
from ..models.schemas import ImageMetadataResponse

router = APIRouter()


@router.get("/images")
def get_images(db: Session = Depends(get_db)):
    """
    Get a list of all uploaded images along with their metadata.
    
    Returns:
        A list of ImageMetadataResponse objects containing metadata for each uploaded image.
    """
    db_images = crud.get_all_images(db)
    
    return [
        ImageMetadataResponse(
            filename=img.filename,
            source=img.source,
            copyright=img.copyright,
            dataset_release=img.dataset_release,
            description=img.description,
            data_processing_stages=img.data_processing_stages,
            coordinates=img.coordinates,
            is_public=img.is_public,
            upload_date=img.upload_date.isoformat()
        ).model_dump(by_alias=True)
        for img in db_images
    ]