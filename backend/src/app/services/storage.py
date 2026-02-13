import os
from fastapi import UploadFile

def get_upload_dir():
    """Get upload directory from environment or use default"""
    return os.getenv("UPLOAD_PATH", "/storage/uploads")

def save_file(file: UploadFile) -> str:
    """
    Save uploaded file.
    
    Args:
        file: UploadFile object from FastAPI
    
    Returns:
        ImageMetadataResponse with all metadata including filename and upload date
    """

    upload_dir = get_upload_dir()
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    return file.filename