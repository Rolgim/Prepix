FROM python:3.12-slim


WORKDIR /app


COPY pyproject.toml ./
RUN pip install --upgrade pip && pip install fastapi uvicorn python-multipart


COPY src ./src


CMD ["uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8000"]