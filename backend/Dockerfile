ARG PYTHON_VERSION=3.13

# Stage 1: Build dependencies
FROM --platform=$BUILDPLATFORM python:${PYTHON_VERSION}-alpine AS builder

WORKDIR /app

# Install build dependencies and cache pip files for efficiency
COPY requirements.txt /app
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install --prefix=/install -r requirements.txt

COPY . /app

# Stage 2: Development environment setup
FROM python:${PYTHON_VERSION}-alpine AS dev

WORKDIR /app

# Copy application files and installed dependencies
COPY --from=builder /install /usr/local
COPY . /app

# Install additional tools for development (e.g., Git, Bash)
RUN apk update && apk add --no-cache git bash

# Create a non-root user for better security
RUN addgroup -S docker && \
    adduser -S --shell /bin/bash --ingroup docker vscode

ENV FLASK_APP=run.py
ENV FLASK_ENV=dev
EXPOSE 5000

# Use Flask's dev server in development
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]

# Stage 3: Production-ready image
FROM python:${PYTHON_VERSION}-alpine AS prod

WORKDIR /app

# Copy only necessary application files and dependencies
COPY --from=builder /install /usr/local
COPY run.py /app

ENV FLASK_ENV=prod

# Use Gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]
