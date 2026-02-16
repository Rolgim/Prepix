import os
import uuid
import shutil
from pathlib import Path
import magic
from fastapi import UploadFile

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

ALLOWED_MIME = {
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime"
}


def get_upload_dir():
    """Get upload directory from environment or use default"""
    return os.getenv("UPLOAD_PATH", "/storage/uploads")


def generate_safe_filename(original_filename: str):
    ext = Path(original_filename).suffix.lower()
    return f"{uuid.uuid4()}{ext}"


def validate_file(file: UploadFile):

    # Validate size
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)

    if size > MAX_FILE_SIZE:
        raise ValueError("File too large")

    # Validate mime
    mime = magic.from_buffer(file.file.read(2048), mime=True)
    file.file.seek(0)

    if mime not in ALLOWED_MIME:
        raise ValueError(f"Invalid MIME type: {mime}")
    
def save_file(file: UploadFile) -> str:
    """
    Save uploaded file.
    
    Args:
        file: UploadFile object from FastAPI
    """

    validate_file(file)

    upload_dir = Path(get_upload_dir())
    upload_dir.mkdir(parents=True, exist_ok=True)

    safe_filename = generate_safe_filename(file.filename)
    file_path = upload_dir / safe_filename

    if file_path.exists():
        raise ValueError("Collision detected")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return safe_filename