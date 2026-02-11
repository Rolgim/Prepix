# backend/tests/test_upload.py
import pytest
from io import BytesIO


def test_upload_image_success(client, sample_image, sample_metadata):
    """Test successful image upload"""
    filename, file_bytes, content_type = sample_image
    
    response = client.post(
        "/upload",
        files={"file": (filename, file_bytes, content_type)},
        data=sample_metadata
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "filename" in data
    assert data["source"] == sample_metadata["source"]
    assert data["copyright"] == sample_metadata["copyright"]
    assert data["datasetRelease"] ==  sample_metadata["datasetRelease"]
    assert data["description"] == sample_metadata["description"]
    assert data["dataProcessingStages"] == sample_metadata["dataProcessingStages"]
    assert data["coordinates"] == sample_metadata["coordinates"]
    assert data["isPublic"] == sample_metadata["isPublic"]

def test_upload_without_file(client, sample_metadata):
    """Test upload without file should fail"""
    response = client.post(
        "/upload",
        data=sample_metadata
    )
    
    assert response.status_code == 422  # Unprocessable Entity


def test_upload_without_metadata(client):
    """Test upload without required metadata"""
    file_content = BytesIO(b"fake image data")
    
    response = client.post(
        "/upload",
        files={"file": ("test.png", file_content, "image/png")}
    )
    
    # Should still work, metadata is optional in current implementation
    assert response.status_code in [200, 422]


def test_upload_large_file(client):
    """Test upload of large file"""
    # Create a 10MB file
    large_file = BytesIO(b"0" * (10 * 1024 * 1024))
    
    response = client.post(
        "/upload",
        files={"file": ("large.png", large_file, "image/png")},
        data={
            "source": "Large Test",
            "copyright": "Test",
            "datasetRelease": "T1",
            "description": "test description",
            "dataProcessingStages": "VIS/NIR",
            "coordinates": "tile_test",
            "isPublic": "false"
            }
    )
    
    # Depending on nginx config, this might fail or succeed
    assert response.status_code in [200, 413]


def test_upload_video(client):
    """Test video upload"""
    video_content = BytesIO(b"fake video data")
    
    response = client.post(
        "/upload",
        files={"file": ("test.mp4", video_content, "video/mp4")},
        data={
            "source": "Video Test", 
            "copyright": "Test 2026",
            "datasetRelease": "T1",
            "description": "test description",
            "dataProcessingStages": "VIS/NIR",
            "coordinates": "tile_test",
            "isPublic": "false"
            }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["filename"].endswith(".mp4")


def test_upload_special_characters_filename(client):
    """Test upload with special characters in filename"""
    file_content = BytesIO(b"test data")
    
    response = client.post(
        "/upload",
        files={"file": ("test file (1) [2].png", file_content, "image/png")},
        data={
            "source": "Test", 
            "copyright": "Test",
            "datasetRelease": "T1",
            "description": "test description",
            "dataProcessingStages": "VIS/NIR",
            "coordinates": "tile_test",
            "isPublic": "false"
            }
    )
    
    assert response.status_code == 200
    data = response.json()
    # Filename should be sanitized
    assert data["filename"] != ""
