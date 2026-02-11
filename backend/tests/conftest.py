# backend/tests/conftest.py
import pytest
import tempfile
import shutil
from pathlib import Path
from fastapi.testclient import TestClient


@pytest.fixture
def temp_upload_dir():
    """Create a temporary upload directory for tests"""
    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    shutil.rmtree(temp_dir)


@pytest.fixture
def client(temp_upload_dir, monkeypatch):
    """Create a test client with temporary storage"""
    # Patch the storage path
    monkeypatch.setenv("UPLOAD_PATH", temp_upload_dir)
    
    # Import after patching environment
    from src.app.main import app
    
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def sample_image():
    """Create a sample image file for testing"""
    from io import BytesIO
    from PIL import Image
    
    img = Image.new('RGB', (100, 100), color='red')
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    return ("test_image.png", img_bytes, "image/png")


@pytest.fixture
def sample_metadata():
    """Sample metadata for uploads"""
    return {
        "source": "Test Source",
        "copyright": "Test Copyright 2026",
        "datasetRelease": "Test Release",
        "description": "Test Description",
        "dataProcessingStages": "Test Stages",
        "coordinates": "Test Coordinates",
        "isPublic": "false"
    }
