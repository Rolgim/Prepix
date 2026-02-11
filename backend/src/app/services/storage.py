import os
import json
from fastapi import UploadFile
from pathlib import Path
from datetime import date


def get_upload_dir():
    """Get upload directory from environment or use default"""
    return os.getenv("UPLOAD_PATH", "/storage/uploads")


def get_metadata_file():
    """Get metadata file path"""
    return os.path.join(get_upload_dir(), "metadata.json")


def save_file(
    file: UploadFile,
    source: str, 
    copyright: str, 
    dataset_release: str, 
    description: str, 
    data_processing_stages: str, 
    coordinates: str,
    public: str
    ):
    """Save uploaded file with metadata"""

    upload_dir = get_upload_dir()
    os.makedirs(upload_dir, exist_ok=True)  # Créer seulement quand nécessaire
    
    file_path = os.path.join(upload_dir, file.filename)
    
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    
    # Save metadata
    metadata_file = get_metadata_file()
    metadata = {}
    
    if os.path.exists(metadata_file):
        with open(metadata_file, "r") as f:
            try:
                metadata = json.load(f)
            except json.JSONDecodeError:
                metadata = {}
    
    metadata[file.filename] = {
        "source": source,
        "copyright": copyright,
        "datasetRelease": dataset_release,
        "description": description,
        "dataProcessingStages": data_processing_stages,
        "coordinates": coordinates,
        "isPublic": public,
        "uploadDate": date.today().isoformat()
    }
    
    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=2)
    
    return {
        "filename": file.filename, 
        "source": source, 
        "copyright": copyright, 
        "datasetRelease": dataset_release, 
        "description": description, 
        "dataProcessingStages": data_processing_stages, 
        "coordinates": coordinates,
        "isPublic": public, 
        "uploadDate": date.today().isoformat()
        }


def list_files():
    """List all uploaded files with metadata"""
    upload_dir = get_upload_dir()
    
    if not os.path.exists(upload_dir):
        return []
    
    metadata_file = get_metadata_file()
    metadata = {}
    
    if os.path.exists(metadata_file):
        with open(metadata_file, "r") as f:
            try:
                metadata = json.load(f)
            except json.JSONDecodeError:
                metadata = {}
    
    files = []
    for filename in os.listdir(upload_dir):
        if filename == "metadata.json":
            continue
        
        file_metadata = metadata.get(filename, {})
        files.append({
            "filename": filename,
            "source": file_metadata.get("source", ""),
            "copyright": file_metadata.get("copyright", ""),
            "datasetRelease": file_metadata.get("datasetRelease", ""),
            "description": file_metadata.get("description", ""),
            "dataProcessingStages": file_metadata.get("dataProcessingStages", ""),
            "coordinates": file_metadata.get("coordinates", ""),
            "isPublic": file_metadata.get("isPublic", ""),
            "uploadDate": file_metadata.get("uploadDate", "")
        })
    
    return files