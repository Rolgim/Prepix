from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..database.database import get_db
from ..database import crud
from ..models.schemas import ImageMetadataResponse

router = APIRouter()


@router.get("/images")
def get_images(
    source: Optional[str] = Query(None),
    copyright: Optional[str] = Query(None),
    dataset_release: Optional[str] = Query(None, alias="datasetRelease"),
    description: Optional[str] = Query(None),
    data_processing_stages: Optional[str] = Query(None, alias="dataProcessingStages"),
    coordinates: Optional[str] = Query(None),
    is_public: Optional[bool] = Query(None, alias="isPublic"),
    db: Session = Depends(get_db)
):
    """
    Get a list of all uploaded images along with their metadata, 
    with options to filter by metadata fields. The response includes metadata for each image in camelCase format.
    
    Returns:
        A list of ImageMetadataResponse objects containing metadata for each uploaded image.
    """
    filtered_images = crud.get_filtered_images(
        db,
        source=source,
        copyright=copyright,
        dataset_release=dataset_release,
        description=description,
        data_processing_stages=data_processing_stages,
        coordinates=coordinates,
        is_public=is_public
    )
    
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
        for img in filtered_images
    ]