from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.concurrency import run_in_threadpool
from ..services.storage import save_file
from ..models.schemas import ImageMetadataCreate, ImageMetadataResponse
from pydantic import ValidationError

router = APIRouter()


@router.post("/upload", response_model=ImageMetadataResponse)
async def upload_image(
    file: UploadFile = File(...),
    metadata: ImageMetadataCreate = Depends(ImageMetadataCreate.as_form)
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
            detail=f"File type {file_ext} not allowed. Allowed: {', '.join(allowed_extensions)}"
        )
    
    result = await run_in_threadpool(
        save_file,
        file,
        metadata
    )
    
    return result
