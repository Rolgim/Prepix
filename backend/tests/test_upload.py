import pytest
from fastapi.testclient import TestClient
from io import BytesIO


def test_upload_image_success(client, sample_image, temp_upload_dir):
    """Test successful image upload with all fields"""

    response = client.post(
        "/upload",
        files={"file": sample_image},
        data={
            "source": "Euclid",
            "copyright": "© ESA 2026",
            "datasetRelease": "DR1",
            "description": "Test description",
            "dataProcessingStages": "Raw → Calibrated",
            "coordinates": "RA: 10h20m30s, DEC: +45°",
            "isPublic": "true"
        }
    )

    assert response.status_code == 200
    data = response.json()

    assert data["filename"] == sample_image[0]
    assert data["source"] == "Euclid"
    assert data["isPublic"] is True
    assert "uploadDate" in data


def test_upload_invalid_boolean(client, sample_image):
    """Test upload with invalid boolean value"""

    response = client.post(
        "/upload",
        files={"file": sample_image},
        data={
            "source": "Test",
            "copyright": "Test",
            "datasetRelease": "DR1",
            "description": "Test",
            "dataProcessingStages": "Test",
            "coordinates": "Test",
            "isPublic": "invalid_boolean"
        }
    )

    assert response.status_code == 422


def test_upload_missing_field(client, sample_image):
    """Test upload with missing required field"""

    response = client.post(
        "/upload",
        files={"file": sample_image},
        data={
            "source": "Test",
            "copyright": "Test",
            # datasetRelease is missing
            "description": "Test",
            "dataProcessingStages": "Test",
            "coordinates": "Test",
            "isPublic": "true"
        }
    )

    assert response.status_code == 422


def test_upload_invalid_file_type(client):
    """Test upload with invalid file type"""

    fake_file = BytesIO(b"not an image")

    response = client.post(
        "/upload",
        data={
            "source": "Test",
            "copyright": "Test",
            "datasetRelease": "DR1",
            "description": "Test",
            "dataProcessingStages": "Test",
            "coordinates": "Test",
            "isPublic": "true"
        },
        files={"file": ("test.txt", fake_file, "text/plain")}
    )

    assert response.status_code == 400
