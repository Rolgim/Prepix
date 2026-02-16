import pytest
from io import BytesIO


def test_upload_image_success(client, sample_image, temp_upload_dir):
    """Test successful image upload with all fields"""
    
    filename, file_bytes, content_type = sample_image
    
    response = client.post(
        "/upload",
        data={
            "source": "Euclid",
            "copyright": "© ESA 2026",
            "datasetRelease": "DR1",
            "description": "Test description",
            "dataProcessingStages": "Raw → Calibrated",
            "coordinates": "RA: 10h20m30s, DEC: +45°",
            "isPublic": "true"
        },
        files={"file": (filename, file_bytes, content_type)}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["source"] == "Euclid"
    assert data["isPublic"] is True
    assert "uploadDate" in data


def test_upload_invalid_boolean(client, sample_image):
    """Test upload with invalid boolean value"""
    filename, file_bytes, content_type = sample_image
    
    response = client.post(
        "/upload",
        data={
            "source": "Test",
            "copyright": "Test",
            "datasetRelease": "DR1",
            "description": "Test",
            "dataProcessingStages": "Test",
            "coordinates": "Test",
            "isPublic": "invalid_boolean"
        },
        files={"file": (filename, file_bytes, content_type)}
    )
    
    assert response.status_code == 422


def test_upload_missing_field(client, sample_image):
    """Test upload with missing required field"""
    filename, file_bytes, content_type = sample_image
    
    response = client.post(
        "/upload",
        data={
            "source": "Test",
            "copyright": "Test",
            # datasetRelease manquant
            "description": "Test",
            "dataProcessingStages": "Test",
            "coordinates": "Test",
            "isPublic": "true"
        },
        files={"file": (filename, file_bytes, content_type)}
    )
    
    assert response.status_code == 422


def test_upload_invalid_file_type(client):
    """Test upload with invalid file type"""
    invalid_file = BytesIO(b"not an allowed file")
    
    response = client.post(
        "/upload",
        data={
            "source": "Test",
            "copyright": "Test",
            "datasetRelease": "DR1",
            "description": "Test",
            "dataProcessingStages": "VIS/NIR",
            "coordinates": "Test",
            "isPublic": "false"
        },
        files={"file": ("test.txt", invalid_file, "text/plain")}
    )
    
    assert response.status_code == 400


def test_upload_duplicate_filename(client, sample_image):
    """Test uploading the same file twice"""
    filename, file_bytes, content_type = sample_image
    
    metadata = {
        "source": "Test",
        "copyright": "Test",
        "datasetRelease": "DR1",
        "description": "Test",
        "dataProcessingStages": "Test",
        "coordinates": "Test",
        "isPublic": "false"
    }
    
    # first upload
    response1 = client.post(
        "/upload",
        files={"file": (filename, file_bytes, content_type)},
        data=metadata
    )
    assert response1.status_code == 200
    
    # Reset  BytesIO
    file_bytes.seek(0)
    
    # Second upload with the same filename
    response2 = client.post(
        "/upload",
        files={"file": (filename, file_bytes, content_type)},
        data=metadata
    )
    # Duplicates (in terms of filenames) are currently allowed, but this test ensures it doesn't cause an error
    assert response2.status_code == 200  
