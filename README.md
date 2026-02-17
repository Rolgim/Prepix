# Euclid Prepix

Euclid Pretty Pics Portal. A full-stack application for managing and displaying images.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Python, FastAPI, SQLAlchemy, Alembic
- **Database:** PostgreSQL
- **Testing:** Vitest (frontend), Pytest (backend)
- **Containerization:** Docker, Docker Compose
- **Web Server:** Nginx

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Make
- Python 3.12+
- Node.js and npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Prepix
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the `backend/` directory by copying the example file:
    ```bash
    cp backend/.env.example backend/.env
    ```
    Update the `backend/.env` file with your database credentials and other settings.

3.  **Install dependencies:**
    Use the `make` command to install all backend and frontend dependencies.
    ```bash
    make install
    ```

## Running the Application

To run the application in a containerized environment, use Docker Compose:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:80`.

## Testing

This project includes a comprehensive test suite for both the frontend and backend.

### Run all tests

To run all tests for both the frontend and backend, use the following command:

```bash
make test
```

### Backend Tests

To run only the backend tests:

```bash
make test-backend
```

### Frontend Tests

To run only the frontend tests:

```bash
make test-frontend
```

### Test Coverage

To generate test coverage reports for both frontend and backend:

```bash
make coverage
```
Coverage reports will be generated in the `frontend/coverage/` and `backend/htmlcov/` directories.

### Running Tests in Docker

To run the tests within a Docker container (as in a CI environment), use:

```bash
make docker-test
```
