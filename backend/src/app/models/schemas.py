from pydantic import BaseModel, Field, field_validator, ValidationError, ConfigDict
from fastapi import HTTPException
from fastapi import Form
from datetime import datetime


class ImageMetadata(BaseModel):
    """Image metadata schema with validation and example for API documentation"""
    
    filename: str
    source: str = Field(..., min_length=1, max_length=200, description="Data source (ex: M31)")
    copyright: str = Field(..., min_length=1, max_length=200, description="Copyright information")
    dataset_release: str = Field(
        ..., 
        alias="datasetRelease",
        min_length=1, 
        max_length=50,
        description="Dataset release version (ex: DR1, DR2)"
    )
    description: str = Field(..., min_length=1, max_length=2000, description="Image description")
    data_processing_stages: str = Field(
        ..., 
        alias="dataProcessingStages",
        min_length=1,
        max_length=500,
        description="Data processing stages (ex: Raw → Calibrated → Stacked)"
    )
    coordinates: str = Field(..., min_length=1, max_length=100, description="Astronomical coordinates (ex: RA: 00h42m44s, DEC: +41°16'09\") or tile name")
    is_public: bool = Field(..., alias="isPublic", description="Privacy status of the image (true for public, false for private)")
    upload_date: datetime = Field(default_factory=lambda: datetime.utcnow, description="Upload date in ISO format (YYYY-MM-DD)", alias="uploadDate")
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={  # Allow population by field name or alias for compatibility with frontend
            "example": {
                "filename": "galaxy_m31.png",
                "source": "M31",
                "copyright": "© ESA 2026",
                "datasetRelease": "DR1",
                "description": "Andromeda Galaxy observation",
                "dataProcessingStages": "Raw → Calibrated → Stacked",
                "coordinates": "RA: 00h42m44s, DEC: +41°16'09\"",
                "isPublic": True,
                "uploadDate": "2026-02-11"
            }
        })


class ImageMetadataCreate(BaseModel):
    """Schema for creating new image metadata with validation"""

    model_config = ConfigDict(populate_by_name=True)

    source: str = Field(..., min_length=1, max_length=200)
    copyright: str = Field(..., min_length=1, max_length=200)
    dataset_release: str = Field(..., alias="datasetRelease", min_length=1, max_length=50)
    description: str = Field(..., min_length=1, max_length=2000)
    data_processing_stages: str = Field(..., alias="dataProcessingStages", min_length=1, max_length=500)
    coordinates: str = Field(..., min_length=1, max_length=100)
    is_public: bool = Field(..., alias="isPublic")
    
    @field_validator('is_public', mode='before')
    @classmethod
    def convert_public_to_bool(cls, v):
        """Convert string representations of boolean values to actual booleans"""
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            if v.lower() in ('true', '1', 'yes'):
                return True
            if v.lower() in ('false', '0', 'no'):
                return False
        raise ValueError(f'Invalid boolean value: {v}')
    
    @classmethod
    def as_form(
        cls,
        source: str = Form(...),
        copyright: str = Form(...),
        datasetRelease: str = Form(...),
        description: str = Form(...),
        dataProcessingStages: str = Form(...),
        coordinates: str = Form(...),
        isPublic: str = Form(...)
    ):
        try:
            return cls(
                source=source,
                copyright=copyright,
                datasetRelease=datasetRelease,
                description=description,
                dataProcessingStages=dataProcessingStages,
                coordinates=coordinates,
                isPublic=isPublic
            )
        except ValidationError as e:
            error_list = [{"loc": error["loc"], "msg": error["msg"]} for error in e.errors()]
            raise HTTPException(status_code=422, detail=error_list)



class ImageMetadataResponse(ImageMetadata):
    """Schema for image metadata response, inheriting from ImageMetadata"""
    pass