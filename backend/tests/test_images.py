# backend/tests/test_images.py
import pytest
from io import BytesIO


def test_get_images_empty(client):
    """Test getting images when storage is empty"""
    response = client.get("/images")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_get_images_after_upload(client, sample_image, sample_metadata):
    """Test getting images after uploading one"""
    filename, file_bytes, content_type = sample_image
    
    # Upload an image first
    upload_response = client.post(
        "/upload",
        files={"file": (filename, file_bytes, content_type)},
        data=sample_metadata
    )
    assert upload_response.status_code == 200
    
    # Now get the list
    response = client.get("/images")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    
    # Check structure
    image = data[0]
    assert "filename" in image
    assert "source" in image
    assert "copyright" in image
    assert image["source"] == sample_metadata["source"]
    assert image["copyright"] == sample_metadata["copyright"]


def test_get_images_multiple_uploads(client, sample_metadata):
    """Test getting multiple images"""
    # Upload 3 different images
    for i in range(3):
        file_content = BytesIO(f"image {i}".encode())
        client.post(
            "/upload",
            files={"file": (f"test_{i}.png", file_content, "image/png")},
            data={
                "source": f"Source {i}",
                "copyright": f"Copyright {i}"
            }
        )
    
    # Get all images
    response = client.get("/images")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3


def test_images_return_correct_structure(client, sample_image, sample_metadata):
    """Test that images endpoint returns correct data structure"""
    filename, file_bytes, content_type = sample_image
    
    # Upload
    client.post(
        "/upload",
        files={"file": (filename, file_bytes, content_type)},
        data=sample_metadata
    )
    
    # Get images
    response = client.get("/images")
    data = response.json()
    
    # Verify structure
    assert isinstance(data, list)
    assert len(data) > 0
    
    image = data[0]
    required_fields = ["filename", "source", "copyright"]
    for field in required_fields:
        assert field in image, f"Missing required field: {field}"


def test_images_ordering(client):
    """Test that images are returned in consistent order"""
    # Upload multiple images
    filenames = []
    for i in range(5):
        file_content = BytesIO(f"image {i}".encode())
        response = client.post(
            "/upload",
            files={"file": (f"test_{i}.png", file_content, "image/png")},
            data={"source": f"Source {i}", "copyright": f"Copyright {i}"}
        )
        filenames.append(response.json()["filename"])
    
    # Get images twice
    response1 = client.get("/images")
    response2 = client.get("/images")
    
    data1 = response1.json()
    data2 = response2.json()
    
    # Order should be consistent
    assert [img["filename"] for img in data1] == [img["filename"] for img in data2]
