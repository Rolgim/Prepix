import pytest
from src.app.database.crud import (
    create_image_metadata,
    get_image_by_filename,
    get_all_images,
    get_public_images,
    update_image_metadata,
    delete_image_metadata,
)
from src.app.models.schemas import ImageMetadataCreate


def build_metadata(**overrides):
    """Helper function to build ImageMetadataCreate with default values, allowing overrides"""
    data = {
        "source": "Test Source",
        "copyright": "Test Copyright",
        "datasetRelease": "DR-Test",
        "description": "Test Description",
        "dataProcessingStages": "Raw → Processed",
        "coordinates": "RA 0 DEC 0",
        "isPublic": True
    }
    data.update(overrides)
    return ImageMetadataCreate(**data)


def test_create_image_metadata(db_session):
    metadata = build_metadata()

    image = create_image_metadata(
        db_session,
        filename="test.png",
        metadata=metadata
    )

    assert image.id is not None
    assert image.filename == "test.png"
    assert image.source == "Test Source"
    assert image.is_public is True


def test_get_image_by_filename(db_session):
    metadata = build_metadata()

    create_image_metadata(db_session, "test.png", metadata)

    result = get_image_by_filename(db_session, "test.png")

    assert result is not None
    assert result.filename == "test.png"


def test_get_image_by_filename_not_found(db_session):
    result = get_image_by_filename(db_session, "missing.png")
    assert result is None


def test_get_all_images(db_session):
    create_image_metadata(db_session, "a.png", build_metadata())
    create_image_metadata(db_session, "b.png", build_metadata())

    images = get_all_images(db_session)

    assert len(images) == 2


def test_get_all_images_pagination(db_session):
    for i in range(5):
        create_image_metadata(db_session, f"img_{i}.png", build_metadata())

    images = get_all_images(db_session, skip=2, limit=2)

    assert len(images) == 2


def test_get_public_images(db_session):
    create_image_metadata(db_session, "public.png", build_metadata(isPublic=True))
    create_image_metadata(db_session, "private.png", build_metadata(isPublic=False))

    public_images = get_public_images(db_session)

    assert len(public_images) == 1
    assert public_images[0].filename == "public.png"


def test_update_image_metadata(db_session):
    create_image_metadata(db_session, "test.png", build_metadata())

    updated = update_image_metadata(
        db_session,
        "test.png",
        build_metadata(source="Updated Source")
    )

    assert updated is not None
    assert updated.source == "Updated Source"


def test_update_image_metadata_not_found(db_session):
    result = update_image_metadata(
        db_session,
        "missing.png",
        build_metadata()
    )

    assert result is None


def test_delete_image_metadata(db_session):
    create_image_metadata(db_session, "test.png", build_metadata())

    deleted = delete_image_metadata(db_session, "test.png")

    assert deleted is True
    assert get_image_by_filename(db_session, "test.png") is None


def test_delete_image_metadata_not_found(db_session):
    deleted = delete_image_metadata(db_session, "missing.png")
    assert deleted is False
