import os
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from google.cloud import storage
import numpy as np
from io import BytesIO

logger = logging.getLogger(__name__)

class CloudStorageService:
    def __init__(self, bucket_name: str):
        """Initialize Cloud Storage service"""
        self.bucket_name = bucket_name
        self.client = None
        self.bucket = None
        
    def initialize(self):
        """Initialize the storage client and bucket"""
        try:
            self.client = storage.Client()
            self.bucket = self.client.bucket(self.bucket_name)
            logger.info(f"Cloud Storage initialized with bucket: {self.bucket_name}")
        except Exception as e:
            logger.error(f"Failed to initialize Cloud Storage: {e}")
            raise
    
    def save_embeddings(self, embeddings: np.ndarray, filename: str = "embeddings.npy") -> bool:
        """Save embeddings array to Cloud Storage"""
        try:
            # Convert numpy array to bytes
            buffer = BytesIO()
            np.save(buffer, embeddings)
            buffer.seek(0)
            
            # Upload to Cloud Storage
            blob = self.bucket.blob(filename)
            blob.upload_from_file(buffer, content_type='application/octet-stream')
            
            logger.info(f"Saved {len(embeddings)} embeddings to gs://{self.bucket_name}/{filename}")
            return True
        except Exception as e:
            logger.error(f"Failed to save embeddings: {e}")
            return False
    
    def load_embeddings(self, filename: str = "embeddings.npy") -> Optional[np.ndarray]:
        """Load embeddings array from Cloud Storage"""
        try:
            blob = self.bucket.blob(filename)
            if not blob.exists():
                logger.warning(f"Embeddings file {filename} not found in storage")
                return None
            
            # Download and convert back to numpy array
            buffer = BytesIO()
            blob.download_to_file(buffer)
            buffer.seek(0)
            embeddings = np.load(buffer)
            
            logger.info(f"Loaded {len(embeddings)} embeddings from gs://{self.bucket_name}/{filename}")
            return embeddings
        except Exception as e:
            logger.error(f"Failed to load embeddings: {e}")
            return None
    
    def save_json(self, data: Any, filename: str) -> bool:
        """Save JSON data to Cloud Storage"""
        try:
            blob = self.bucket.blob(filename)
            blob.upload_from_string(
                json.dumps(data, indent=2, default=str),
                content_type='application/json'
            )
            logger.info(f"Saved JSON data to gs://{self.bucket_name}/{filename}")
            return True
        except Exception as e:
            logger.error(f"Failed to save JSON: {e}")
            return False
    
    def load_json(self, filename: str) -> Optional[Any]:
        """Load JSON data from Cloud Storage"""
        try:
            blob = self.bucket.blob(filename)
            if not blob.exists():
                logger.warning(f"JSON file {filename} not found in storage")
                return None
            
            data = json.loads(blob.download_as_text())
            logger.info(f"Loaded JSON data from gs://{self.bucket_name}/{filename}")
            return data
        except Exception as e:
            logger.error(f"Failed to load JSON: {e}")
            return None
    
    def file_exists(self, filename: str) -> bool:
        """Check if file exists in Cloud Storage"""
        try:
            blob = self.bucket.blob(filename)
            return blob.exists()
        except Exception as e:
            logger.error(f"Failed to check file existence: {e}")
            return False
    
    def list_files(self, prefix: str = "") -> List[str]:
        """List files in the bucket with optional prefix"""
        try:
            blobs = self.client.list_blobs(self.bucket, prefix=prefix)
            return [blob.name for blob in blobs]
        except Exception as e:
            logger.error(f"Failed to list files: {e}")
            return []
    
    def delete_file(self, filename: str) -> bool:
        """Delete a file from Cloud Storage"""
        try:
            blob = self.bucket.blob(filename)
            if blob.exists():
                blob.delete()
                logger.info(f"Deleted file gs://{self.bucket_name}/{filename}")
                return True
            else:
                logger.warning(f"File {filename} not found for deletion")
                return False
        except Exception as e:
            logger.error(f"Failed to delete file: {e}")
            return False
    
    def get_file_info(self, filename: str) -> Optional[Dict[str, Any]]:
        """Get metadata about a file in Cloud Storage"""
        try:
            blob = self.bucket.blob(filename)
            if not blob.exists():
                return None
            
            # Reload to get latest metadata
            blob.reload()
            
            return {
                "name": blob.name,
                "size": blob.size,
                "created": blob.time_created,
                "updated": blob.updated,
                "content_type": blob.content_type,
                "etag": blob.etag
            }
        except Exception as e:
            logger.error(f"Failed to get file info: {e}")
            return None