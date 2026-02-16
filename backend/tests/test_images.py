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
    assert "datasetRelease" in image
    assert "description" in image
    assert "dataProcessingStages" in image
    assert "coordinates" in image
    assert "isPublic" in image
    assert "uploadDate" in image
    
    assert image["source"] == sample_metadata["source"]
    assert image["copyright"] == sample_metadata["copyright"]
    assert image["datasetRelease"] == sample_metadata["datasetRelease"]
    assert image["description"] == sample_metadata["description"]
    assert image["dataProcessingStages"] == sample_metadata["dataProcessingStages"]
    assert image["coordinates"] == sample_metadata["coordinates"]
    assert not(image["isPublic"]) # sample_metadata["isPublic"] is "false", which should be converted to False
    assert image["uploadDate"] is not None


def test_get_images_multiple_uploads(client, sample_metadata, fake_png):
    """Test getting multiple images"""
    # Upload 3 different images
    for i in range(3):
        file_content = fake_png()
        client.post(
            "/upload",
            files={"file": (f"test_{i}.png", file_content, "image/png")},
            data={
                "source": f"Source {i}",
                "copyright": f"Copyright {i}",
                "datasetRelease": f"DR {i}",
                "description": f"Description {i}",
                "dataProcessingStages":"VIS/NIR/MER",
                "coordinates": f"tile_550{i}",
                "isPublic": "false",
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
    required_fields = [
        "filename", 
        "source", 
        "copyright", 
        "datasetRelease", 
        "description", 
        "dataProcessingStages",
        "coordinates", 
        "isPublic",
        "uploadDate"
        ]
    for field in required_fields:
        assert field in image, f"Missing required field: {field}"


def test_images_ordering(client, fake_png):
    """Test that images are returned in consistent order"""
    # Upload multiple images
    filenames = []
    for i in range(5):
        file_content = fake_png()
        response = client.post(
            "/upload",
            files={"file": (f"test_{i}.png", file_content, "image/png")},
            data={
                "source": f"Source {i}",
                "copyright": f"Copyright {i}",
                "datasetRelease": f"DR {i}",
                "description": f"Description {i}",
                "dataProcessingStages":"VIS/NIR/MER",
                "coordinates": f"tile_550{i}",
                "isPublic": False,
                }
        )
        filenames.append(response.json()["filename"])
    
    # Get images twice
    response1 = client.get("/images")
    response2 = client.get("/images")
    
    data1 = response1.json()
    data2 = response2.json()
    
    # Order should be consistent
    assert [img["filename"] for img in data1] == [img["filename"] for img in data2]
