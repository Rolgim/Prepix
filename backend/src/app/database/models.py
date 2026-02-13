from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.sql import func
from .database import Base


class ImageMetadata(Base):
    """SQLAlchemy model for image metadata."""
    
    __tablename__ = "image_metadata"
    
    id = Column(Integer, primary_key=True, index=True)
    
    filename = Column(String(255), unique=True, nullable=False, index=True)
    source = Column(String(200), nullable=False)
    copyright = Column(String(200), nullable=False)
    dataset_release = Column(String(50), nullable=False)
    description = Column(String(2000), nullable=False)
    data_processing_stages = Column(String(500), nullable=False)
    coordinates = Column(String(100), nullable=False)
    is_public = Column(Boolean, default=False, nullable=False)
    
    upload_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<ImageMetadata(filename='{self.filename}', source='{self.source}')>"