from fastapi import APIRouter, UploadFile, File, Form
from fastapi.concurrency import run_in_threadpool

from ..services.storage import save_file

router = APIRouter()

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    source: str = Form(...),
    copyright: str = Form(...),
    dataset_release: str = Form(..., alias= "datasetRelease"),
    description: str = Form(...),
    data_processing_stages: str = Form(..., alias="dataProcessingStages"),
    coordinates: str = Form(...),
    public: str = Form(..., alias="isPublic")
    ):
    result = await run_in_threadpool(
        save_file,
        file,
        source,
        copyright,
        dataset_release,
        description,
        data_processing_stages,
        coordinates,
        public
    )
    return result
