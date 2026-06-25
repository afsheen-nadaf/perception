# Use an official Python base image
FROM python:3.11-slim

# Switch to root to install system dependencies
USER root

# Install OpenJDK 21 AND procps (which gives Spark the 'ps' command it needs)
RUN apt-get update && \
    apt-get install -y --no-install-recommends openjdk-21-jre-headless procps && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Fallback pathing rule directly supporting PySpark's execution layer
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Set up the working directory inside the container
WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# HUGGING FACE COMPLIANCE: Expose port 7860
EXPOSE 7860

# Run using Gunicorn bound to port 7860
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "app:app"]