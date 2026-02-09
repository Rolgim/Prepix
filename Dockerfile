# Frontend build stage
FROM node:20 AS frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Nginx stage
FROM nginx:latest
COPY --from=frontend /app/dist/ /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
