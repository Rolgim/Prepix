from fastapi import APIRouter, UploadFile, File, Form
from fastapi.concurrency import run_in_threadpool

from ..services.storage import save_file

router = APIRouter()

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    source: str = Form(...),
    copyright: str = Form(...),
):
    result = await run_in_threadpool(save_file, file, source, copyright)
    return result