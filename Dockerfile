FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies FIRST (for better Docker layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Pre-download and cache models during build (separate layer for optimal caching)
# This is the KEY improvement - models download at build time, not runtime
RUN python -c "from sentence_transformers import SentenceTransformer; \
    print('Downloading sentence transformer model...'); \
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2'); \
    print('Model downloaded and cached successfully')"

# Pre-download tokenizer as well for completeness
RUN python -c "from transformers import AutoTokenizer; \
    print('Downloading tokenizer...'); \
    tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2'); \
    print('Tokenizer downloaded and cached successfully')"

# Copy application code LAST (changes most frequently, so separate layer)
COPY . .

# Expose port
EXPOSE $PORT

# Health check to verify the container is ready
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

# Run the application
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --workers 1