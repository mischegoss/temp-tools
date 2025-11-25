FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies first
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Set HuggingFace cache directories for build
ENV HF_HOME=/root/.cache/huggingface
ENV TRANSFORMERS_CACHE=/root/.cache/huggingface/hub
ENV SENTENCE_TRANSFORMERS_HOME=/root/.cache/torch/sentence_transformers

# Create cache directories
RUN mkdir -p /root/.cache/huggingface/hub /root/.cache/torch/sentence_transformers

# CRITICAL: Download and cache the sentence transformer model
# This runs during Docker build so the model is in the image
RUN python3 -c "import os; \
from pathlib import Path; \
print('=' * 70); \
print('DOWNLOADING SENTENCE TRANSFORMER MODEL TO DOCKER CACHE FOR PRO API'); \
print('=' * 70); \
print('Cache dir:', os.environ.get('SENTENCE_TRANSFORMERS_HOME')); \
from sentence_transformers import SentenceTransformer; \
import time; \
start = time.time(); \
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2'); \
duration = time.time() - start; \
print(f'Model downloaded in {duration:.1f} seconds'); \
test_embedding = model.encode('test sentence'); \
print(f'Model verified - dimension: {len(test_embedding)}'); \
cache_path = Path(os.environ['SENTENCE_TRANSFORMERS_HOME']); \
files = list(cache_path.rglob('*')) if cache_path.exists() else []; \
file_count = len([f for f in files if f.is_file()]); \
total_size = sum(f.stat().st_size for f in files if f.is_file()) / (1024*1024); \
print(f'Cache: {file_count} files, {total_size:.1f} MB'); \
print('=' * 70); \
print('PRO API MODEL SUCCESSFULLY CACHED IN DOCKER IMAGE'); \
print('=' * 70)"

# Copy application code
COPY . .

# Create data directory
RUN mkdir -p /app/data

# Set up non-root user and copy cache to accessible location
RUN adduser --disabled-password --gecos '' appuser && \
    mkdir -p /home/appuser/.cache && \
    cp -r /root/.cache/* /home/appuser/.cache/ && \
    chown -R appuser:appuser /home/appuser/.cache && \
    chown -R appuser:appuser /app && \
    echo "Verifying Pro API cache copy..." && \
    ls -lah /home/appuser/.cache/torch/sentence_transformers/ && \
    du -sh /home/appuser/.cache/torch/sentence_transformers/

# Switch to non-root user
USER appuser

# Update cache paths for runtime (now in appuser's home)
ENV HF_HOME=/home/appuser/.cache/huggingface
ENV TRANSFORMERS_CACHE=/home/appuser/.cache/huggingface/hub
ENV SENTENCE_TRANSFORMERS_HOME=/home/appuser/.cache/torch/sentence_transformers

# CRITICAL: Force offline mode to prevent runtime downloads
# Model is already cached, no need to contact HuggingFace
ENV HF_HUB_OFFLINE=1
ENV TRANSFORMERS_OFFLINE=1

# Verify offline mode works with cached model (as appuser)
RUN python3 -c "import os; \
print('Testing offline model load as appuser for Pro API...'); \
from sentence_transformers import SentenceTransformer; \
import time; \
cache_base = '/home/appuser/.cache/torch/sentence_transformers'; \
model_path = os.path.join(cache_base, 'sentence-transformers_all-MiniLM-L6-v2'); \
print(f'Loading from: {model_path}'); \
start = time.time(); \
model = SentenceTransformer(model_path); \
duration = time.time() - start; \
print(f'✅ Pro API offline load successful in {duration:.2f}s'); \
test = model.encode('test'); \
print(f'✅ Pro API model functional - dimension: {len(test)}'); \
print('=' * 60); \
print('PRO API OFFLINE MODE VERIFIED - NO INTERNET REQUIRED AT RUNTIME'); \
print('=' * 60)"

EXPOSE 8080

# Startup command
CMD exec uvicorn app.main:app --host 0.0.0.0 --port $PORT