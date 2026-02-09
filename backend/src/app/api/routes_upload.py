from fastapi import APIRouter, UploadFile, File, Form
from ..services.storage import save_file


router = APIRouter()


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    source: str = Form(...),
    copyright: str = Form(...),
):
    filename = await save_file(file, source, copyright)
    return {"filename": filename}
