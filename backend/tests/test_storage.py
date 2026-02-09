# backend/tests/test_storage.py
import pytest
import tempfile
import shutil
import json
from pathlib import Path


def test_list_files_empty_directory(temp_upload_dir, monkeypatch):
    """Test listing files in empty directory"""
    monkeypatch.setenv("UPLOAD_PATH", temp_upload_dir)
    
    from src.app.services.storage import list_files
    
    files = list_files()
    assert isinstance(files, list)
    assert len(files) == 0


def test_list_files_with_metadata(temp_upload_dir, monkeypatch):
    """Test listing files with metadata.json"""
    monkeypatch.setenv("UPLOAD_PATH", temp_upload_dir)
    
    # Create a test image and metadata
    test_image = Path(temp_upload_dir) / "test.png"
    test_image.write_bytes(b"fake image")
    
    metadata = {
        "test.png": {
            "source": "Test Source",
            "copyright": "Test Copyright"
        }
    }
    
    metadata_file = Path(temp_upload_dir) / "metadata.json"
    metadata_file.write_text(json.dumps(metadata))
    
    from src.app.services.storage import list_files
    
    files = list_files()
    assert len(files) == 1
    assert files[0]["filename"] == "test.png"
    assert files[0]["source"] == "Test Source"
    assert files[0]["copyright"] == "Test Copyright"


def test_list_files_without_metadata(temp_upload_dir, monkeypatch):
    """Test listing files without metadata.json"""
    monkeypatch.setenv("UPLOAD_PATH", temp_upload_dir)
    
    # Create test images without metadata
    test_image1 = Path(temp_upload_dir) / "image1.png"
    test_image2 = Path(temp_upload_dir) / "image2.jpg"
    test_image1.write_bytes(b"fake image 1")
    test_image2.write_bytes(b"fake image 2")
    
    from src.app.services.storage import list_files
    
    files = list_files()
    assert len(files) == 2
    
    # Should have default empty metadata
    for file_info in files:
        assert "filename" in file_info
        assert "source" in file_info
        assert "copyright" in file_info


def test_list_files_filters_metadata_json(temp_upload_dir, monkeypatch):
    """Test that metadata.json is not included in file list"""
    monkeypatch.setenv("UPLOAD_PATH", temp_upload_dir)
    
    # Create files including metadata.json
    (Path(temp_upload_dir) / "image.png").write_bytes(b"image")
    (Path(temp_upload_dir) / "metadata.json").write_text("{}")
    
    from src.app.services.storage import list_files
    
    files = list_files()
    filenames = [f["filename"] for f in files]
    
    assert "metadata.json" not in filenames
    assert "image.png" in filenames


def test_list_files_multiple_formats(temp_upload_dir, monkeypatch):
    """Test listing files with various formats"""
    monkeypatch.setenv("UPLOAD_PATH", temp_upload_dir)
    
    # Create various file types
    formats = ["image.png", "photo.jpg", "video.mp4", "clip.webm"]
    for filename in formats:
        (Path(temp_upload_dir) / filename).write_bytes(b"data")
    
    from src.app.services.storage import list_files
    
    files = list_files()
    assert len(files) == len(formats)
    
    returned_filenames = [f["filename"] for f in files]
    for expected in formats:
        assert expected in returned_filenames


def test_storage_handles_corrupted_metadata(temp_upload_dir, monkeypatch):
    """Test that corrupted metadata.json doesn't crash the app"""
    monkeypatch.setenv("UPLOAD_PATH", temp_upload_dir)
    
    # Create corrupted metadata
    metadata_file = Path(temp_upload_dir) / "metadata.json"
    metadata_file.write_text("{ this is not valid json }")
    
    # Create a valid file
    (Path(temp_upload_dir) / "image.png").write_bytes(b"data")
    
    from src.app.services.storage import list_files
    
    # Should not crash, should return files with empty metadata
    files = list_files()
    assert len(files) >= 1
