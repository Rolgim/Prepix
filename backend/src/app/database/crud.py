from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from .models import ImageMetadata as ImageMetadataModel
from ..models.schemas import ImageMetadataCreate


def create_image_metadata(db: Session, filename: str, metadata: ImageMetadataCreate) -> ImageMetadataModel:
    """Create a new image metadata entry in the database"""
    db_image = ImageMetadataModel(
        filename=filename,
        source=metadata.source,
        copyright=metadata.copyright,
        dataset_release=metadata.dataset_release,
        description=metadata.description,
        data_processing_stages=metadata.data_processing_stages,
        coordinates=metadata.coordinates,
        is_public=metadata.is_public
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


def get_image_by_filename(db: Session, filename: str) -> Optional[ImageMetadataModel]:
    """Get image metadata by filename"""
    return db.query(ImageMetadataModel).filter(ImageMetadataModel.filename == filename).first()


def get_all_images(db: Session, skip: int = 0, limit: int = 100) -> List[ImageMetadataModel]:
    """Get all image metadata entries, ordered by upload date descending"""
    return db.query(ImageMetadataModel).order_by(desc(ImageMetadataModel.upload_date)).offset(skip).limit(limit).all()


def get_public_images(db: Session, skip: int = 0, limit: int = 100) -> List[ImageMetadataModel]:
    """Get all public image metadata entries, ordered by upload date descending"""
    return db.query(ImageMetadataModel).filter(
        ImageMetadataModel.is_public == True
    ).order_by(desc(ImageMetadataModel.upload_date)).offset(skip).limit(limit).all()


def update_image_metadata(db: Session, filename: str, metadata: ImageMetadataCreate) -> Optional[ImageMetadataModel]:
    """Update existing image metadata entry in the database"""
    db_image = get_image_by_filename(db, filename)
    if db_image:
        db_image.source = metadata.source
        db_image.copyright = metadata.copyright
        db_image.dataset_release = metadata.dataset_release
        db_image.description = metadata.description
        db_image.data_processing_stages = metadata.data_processing_stages
        db_image.coordinates = metadata.coordinates
        db_image.is_public = metadata.is_public
        db.commit()
        db.refresh(db_image)
    return db_image


def delete_image_metadata(db: Session, filename: str) -> bool:
    """Delete image metadata entry from the database"""
    db_image = get_image_by_filename(db, filename)
    if db_image:
        db.delete(db_image)
        db.commit()
        return True
    return False