from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ..database import get_db
from ..database.crud import create_image_metadata
from ..services.storage import save_file
from ..models.schemas import ImageMetadataCreate, ImageMetadataResponse

router = APIRouter()


@router.post("/upload", response_model=ImageMetadataResponse)
async def upload_image(
    file: UploadFile = File(...),
    metadata: ImageMetadataCreate = Depends(ImageMetadataCreate.as_form),
    db: Session = Depends(get_db)
):
    """
    Upload an image file along with its metadata. 
    The metadata fields are validated using Pydantic, 
    and the file type is checked against allowed extensions.
    camelCase for metadata fields in the API, while using snake_case internally in the Pydantic model. 
    The file and metadata are saved in a thread pool to avoid blocking the event loop.
    """
    allowed_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.webm', '.ogg', '.mov'}
    file_ext = '.' + file.filename.split('.')[-1].lower() if '.' in file.filename else ''
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not allowed."
        )
    
    # Save file in thread pool to avoid blocking event loop
    filename = await run_in_threadpool(save_file, file)
    
    # Create metadata entry in database
    try:
        db_image = create_image_metadata(
            db=db,
            filename=filename,
            metadata=metadata
        )
    except IntegrityError:
        # File already exists in database
        raise HTTPException(
            status_code=409,
            detail=f"File {filename} already exists"
        )
    
    # Convert to response format with camelCase aliases
    return ImageMetadataResponse(
        filename=db_image.filename,
        source=db_image.source,
        copyright=db_image.copyright,
        dataset_release=db_image.dataset_release,
        description=db_image.description,
        data_processing_stages=db_image.data_processing_stages,
        coordinates=db_image.coordinates,
        is_public=db_image.is_public,
        upload_date=db_image.upload_date.isoformat()
    ).model_dump(by_alias=True)