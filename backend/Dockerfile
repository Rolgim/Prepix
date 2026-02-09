FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml ./
RUN pip install --upgrade pip && \
    pip install fastapi uvicorn python-multipart httpx python-dotenv

COPY src ./src

# Créer le dossier data pour le stockage des users
RUN mkdir -p /app/data

CMD ["uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8000"]