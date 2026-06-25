# Use an official Python base image
FROM python:3.11-slim

# Switch to root to install system dependencies
USER root

# Install OpenJDK 21 AND procps for PySpark
RUN apt-get update && \
    apt-get install -y --no-install-recommends openjdk-21-jre-headless procps && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Fallback pathing rule supporting PySpark execution layer
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Set up the working directory to track the root
WORKDIR /app

# Copy the backend requirements first to leverage caching
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the entire backend directory contents into the container
COPY backend/ ./backend/

# Change working directory context to the backend folder so paths match app.py
WORKDIR /app/backend

# HUGGING FACE COMPLIANCE: Expose port 7860
EXPOSE 7860

# Run using Gunicorn bound to port 7860 inside the backend folder context
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "app:app"]