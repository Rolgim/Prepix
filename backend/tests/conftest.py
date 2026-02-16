import pytest
import tempfile
import shutil
import os
from io import BytesIO
from PIL import Image
from pathlib import Path
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Use in-memory SQLite database for testing
TEST_DATABASE_URL = "sqlite:///:memory:"
os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ["UPLOAD_PATH"] = "/tmp/prepix_test_uploads"

from src.app.database.database import Base, get_db
from src.app.main import app

# SQlite in-memory database setup
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},  
    poolclass=StaticPool,  
)

# test session factory
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a new database session for a test, with tables created and dropped after"""
    # Create tables
    Base.metadata.create_all(bind=test_engine)
    
    # Create a new session
    session = TestingSessionLocal()
    
    try:
        yield session
    finally:
        session.close()
        # Drop tables after test to ensure a clean state for the next test
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(db_session, temp_upload_dir, monkeypatch):
    """Create a TestClient with the database session and upload path overridden"""
    # Patch the upload path to use the temporary directory
    monkeypatch.setenv("UPLOAD_PATH", temp_upload_dir)
    
    # Override the get_db dependency to use the test database session
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    # Clear dependency overrides after the test
    app.dependency_overrides.clear()


@pytest.fixture
def temp_upload_dir():
    """Create a temporary directory for uploads during tests, and clean it up afterwards"""
    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.fixture
def sample_image():
    """Create a sample in-memory image file for testing uploads"""
    from io import BytesIO
    from PIL import Image
    
    img = Image.new('RGB', (100, 100), color='red')
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    return ("test_image.png", img_bytes, "image/png")


@pytest.fixture
def sample_metadata():
    """Test metadata for image uploads"""
    return {
        "source": "Test Source",
        "copyright": "Test Copyright 2026",
        "datasetRelease": "Test Release",
        "description": "Test Description",
        "dataProcessingStages": "Test Stages",
        "coordinates": "Test Coordinates",
        "isPublic": "false"
    }


@pytest.fixture
def fake_png():
    def _fake_png():
        img = Image.new("RGB", (10, 10), color="red")
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        return buffer

    return _fake_png