import os
import json
from fastapi import UploadFile


UPLOAD_DIR = "/storage/uploads"
METADATA_FILE = os.path.join(UPLOAD_DIR, "metadata.json")


os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_file(file: UploadFile, source: str, copyright: str):
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as buffer:
        buffer.write(await file.read())

    metadata = []
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, "r") as f:
            metadata = json.load(f)

    metadata.append(
        {"filename": file.filename, "source": source, "copyright": copyright}
    )

    with open(METADATA_FILE, "w") as f:
        json.dump(metadata, f, indent=2)

    return file.filename


def list_files():
    if not os.path.exists(METADATA_FILE):
        return []
    with open(METADATA_FILE, "r") as f:
        return json.load(f)
