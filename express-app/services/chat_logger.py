import json
import csv
from datetime import datetime
from pathlib import Path
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class ChatLogger:
    """Simple chat interaction logger that works locally and on Cloud Run"""
    
    def __init__(self, use_gcs: bool = False, bucket_name: str = "express-chatbot-data"):
        self.use_gcs = use_gcs
        self.gcs_client = None
        self.gcs_bucket = None
        self.bucket_name = bucket_name
        
        if use_gcs:
            try:
                from google.cloud import storage
                self.gcs_client = storage.Client()
                self.gcs_bucket = self.gcs_client.bucket(bucket_name)
                logger.info(f"✅ Chat logger initialized with GCS bucket: {bucket_name}")
            except Exception as e:
                logger.warning(f"⚠️ GCS not available for chat logging: {e}. Using local file logging.")
                self.use_gcs = False
        else:
            logger.info("📝 Chat logger initialized with local file logging")
    
    def log_interaction(self, 
                       prompt: str, 
                       response: str, 
                       metadata: Dict[str, Any]):
        """
        Log a chat interaction
        
        Args:
            prompt: User's input message
            response: AI's response message
            metadata: Additional data (version, processing_time, conversation_id, etc.)
        """
        
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "prompt": prompt,
            "response": response,
            **metadata  # version, processing_time, conversation_id, chunks_used, etc.
        }
        
        # Always log to console for Cloud Logging to capture
        logger.info(f"💬 CHAT: {prompt[:50]}... → {len(response)} chars in {metadata.get('processing_time_ms', 0):.0f}ms")
        
        # Write to storage
        try:
            if self.use_gcs:
                self._write_to_gcs(log_entry)
            else:
                self._write_to_local(log_entry)
        except Exception as e:
            logger.error(f"Failed to write chat log: {e}")
    
    def _write_to_gcs(self, log_entry: Dict[str, Any]):
        """Append to GCS log file (JSONL format)"""
        try:
            # Use monthly log files for easy organization
            month = datetime.utcnow().strftime("%Y-%m")
            blob_name = f"chat-logs/interactions-{month}.jsonl"
            
            blob = self.gcs_bucket.blob(blob_name)
            
            # Append mode: download existing, append new line, upload
            existing = ""
            if blob.exists():
                existing = blob.download_as_text()
            
            # Add new entry as a JSON line
            new_content = existing + json.dumps(log_entry) + "\n"
            blob.upload_from_string(new_content, content_type="application/jsonl")
            
            logger.debug(f"✅ Logged to GCS: {blob_name}")
            
        except Exception as e:
            logger.error(f"Failed to write to GCS: {e}")
            # Fallback to local logging
            self._write_to_local(log_entry)
    
    def _write_to_local(self, log_entry: Dict[str, Any]):
        """Write to local CSV file for development/testing"""
        try:
            log_file = Path("/tmp/chat_logs.csv")
            
            file_exists = log_file.exists()
            
            with open(log_file, 'a', newline='', encoding='utf-8') as f:
                if not file_exists:
                    # Write header
                    f.write("timestamp,prompt,response,version,processing_time_ms,conversation_id,chunks_used\n")
                
                # Write data (escape quotes in CSV)
                prompt_escaped = log_entry["prompt"].replace('"', '""')
                response_escaped = log_entry["response"][:500].replace('"', '""')  # Truncate long responses
                
                f.write(f'"{log_entry["timestamp"]}",'
                       f'"{prompt_escaped}",'
                       f'"{response_escaped}",'
                       f'"{log_entry.get("version", "")}",'
                       f'"{log_entry.get("processing_time_ms", 0)}",'
                       f'"{log_entry.get("conversation_id", "")}",'
                       f'"{log_entry.get("chunks_used", 0)}"\n')
                
            logger.debug(f"✅ Logged to local file: {log_file}")
            
        except Exception as e:
            logger.error(f"Failed to write to local file: {e}")
    
    def get_status(self) -> Dict[str, Any]:
        """Get chat logger status"""
        return {
            "initialized": True,
            "gcs_enabled": self.use_gcs,
            "bucket_name": self.bucket_name if self.use_gcs else None,
            "local_file": "/tmp/chat_logs.csv" if not self.use_gcs else None
        }

