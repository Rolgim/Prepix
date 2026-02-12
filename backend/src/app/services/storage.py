import os
import json
from fastapi import UploadFile
from pathlib import Path
from datetime import date
from ..models.schemas import ImageMetadataCreate, ImageMetadataResponse


def get_upload_dir():
    """Get upload directory from environment or use default"""
    return os.getenv("UPLOAD_PATH", "/storage/uploads")


def get_metadata_file():
    """Get metadata file path"""
    return os.path.join(get_upload_dir(), "metadata.json")


def save_file(file: UploadFile, metadata: ImageMetadataCreate) -> ImageMetadataResponse:
    """
    Save uploaded file with metadata.
    
    Args:
        file: UploadFile object from FastAPI
        metadata: Pydantic validated metadata for the image
    
    Returns:
        ImageMetadataResponse with all metadata including filename and upload date
    """

    upload_dir = get_upload_dir()
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save the file to the upload directory
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    
    # Load existing metadata or initialize an empty dictionary
    metadata_file = get_metadata_file()
    all_metadata = {}
    
    if os.path.exists(metadata_file):
        with open(metadata_file, "r") as f:
            try:
                all_metadata = json.load(f)
            except json.JSONDecodeError:
                all_metadata = {}
    
    # Create the metadata response object with the filename and upload date
    image_metadata = ImageMetadataResponse(
        filename=file.filename,
        source=metadata.source,
        copyright=metadata.copyright,
        dataset_release=metadata.dataset_release,
        description=metadata.description,
        data_processing_stages=metadata.data_processing_stages,
        coordinates=metadata.coordinates,
        is_public=metadata.is_public,
        uploadDate=date.today().isoformat()
    )
    
    # Save the metadata for this file, with alias for frontend compatibility
    all_metadata[file.filename] = image_metadata.model_dump(by_alias=True)
    
    with open(metadata_file, "w") as f:
        json.dump(all_metadata, f, indent=2)
    
    return image_metadata


def list_files() -> list[ImageMetadataResponse]:
    """
    List all uploaded files with metadata.
    
    Returns:
        List of ImageMetadataResponse
    """

    upload_dir = get_upload_dir()
    
    if not os.path.exists(upload_dir):
        return []
    
    metadata_file = get_metadata_file()
    all_metadata = {}
    
    if os.path.exists(metadata_file):
        with open(metadata_file, "r") as f:
            try:
                all_metadata = json.load(f)
            except json.JSONDecodeError:
                all_metadata = {}
    
    files = []
    for filename in os.listdir(upload_dir):
        if filename == "metadata.json":
            continue
        
        file_metadata = all_metadata.get(filename, {})
        
        # Use of pydantic model to ensure consistent response format, with error handling to skip files with invalid metadata
        try:
            image_metadata = ImageMetadataResponse(
                filename=filename,
                source=file_metadata.get("source", "Unknown"),
                copyright=file_metadata.get("copyright", "Unknown"),
                dataset_release=file_metadata.get("datasetRelease", "Unknown"),
                description=file_metadata.get("description", "Unknown"),
                data_processing_stages=file_metadata.get("dataProcessingStages", "Unknown"),
                coordinates=file_metadata.get("coordinates", "Unknown"),
                is_public=file_metadata.get("isPublic", False),
                uploadDate=file_metadata.get("uploadDate", date.today().isoformat())
            )
            files.append(image_metadata)
        except Exception as e:
            # Log the error and skip this file if metadata is invalid
            print(f"Error parsing metadata for {filename}: {e}")
            continue
    
    return files