import json
import numpy as np
import hashlib
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from sentence_transformers import SentenceTransformer
import logging

from app.config import (
    DATA_DIR, EMBEDDINGS_FILE, METADATA_FILE, CHUNKS_FILE, 
    LAST_PROCESSED_FILE, EMBEDDING_MODEL, EMBEDDING_DIMENSION
)
from app.models.upload import DocumentChunk, UploadRequest
from app.models.metadata import EmbeddingMetadata

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.model = None
        self.embeddings = None
        self.metadata = {}
        self.chunk_data = []
        self.model_loaded = False
        
    def initialize(self):
        """Initialize the sentence transformer model"""
        try:
            logger.info(f"Loading embedding model: {EMBEDDING_MODEL}")
            self.model = SentenceTransformer(EMBEDDING_MODEL)
            self.model_loaded = True
            logger.info("✅ Embedding model loaded successfully")
            
            # Load existing data if available
            self.load_existing_data()
            
        except Exception as e:
            logger.error(f"Failed to initialize document processor: {e}")
            raise
    
    def load_existing_data(self):
        """Load existing embeddings and metadata from disk"""
        try:
            # Load embeddings if they exist
            if EMBEDDINGS_FILE.exists():
                self.embeddings = np.load(EMBEDDINGS_FILE)
                logger.info(f"Loaded {len(self.embeddings)} existing embeddings")
            
            # Load metadata if it exists
            if METADATA_FILE.exists():
                with open(METADATA_FILE, 'r') as f:
                    metadata_list = json.load(f)
                    self.metadata = {item['chunk_id']: item for item in metadata_list}
                logger.info(f"Loaded metadata for {len(self.metadata)} chunks")
            
            # Load chunk data if it exists
            if CHUNKS_FILE.exists():
                with open(CHUNKS_FILE, 'r') as f:
                    data = json.load(f)
                    self.chunk_data = data.get('chunks', [])
                logger.info(f"Loaded {len(self.chunk_data)} existing chunks")
                
        except Exception as e:
            logger.warning(f"Could not load existing data: {e}")
            self.embeddings = None
            self.metadata = {}
            self.chunk_data = []
    
    def compute_content_hash(self, content: str) -> str:
        """Compute SHA-256 hash of content for change detection"""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
    
    def detect_changes(self, new_chunks: List[DocumentChunk]) -> Tuple[List[DocumentChunk], List[DocumentChunk], List[str]]:
        """
        Detect what's new, changed, or deleted
        Returns: (new_chunks, changed_chunks, deleted_chunk_ids)
        """
        new_chunks_list = []
        changed_chunks_list = []
        current_chunk_ids = set()
        
        for chunk in new_chunks:
            current_chunk_ids.add(chunk.id)
            content_hash = self.compute_content_hash(chunk.content)
            
            if chunk.id not in self.metadata:
                # New chunk
                new_chunks_list.append(chunk)
            elif self.metadata[chunk.id].get('content_hash') != content_hash:
                # Changed chunk
                changed_chunks_list.append(chunk)
        
        # Find deleted chunks
        existing_chunk_ids = set(self.metadata.keys())
        deleted_chunk_ids = list(existing_chunk_ids - current_chunk_ids)
        
        return new_chunks_list, changed_chunks_list, deleted_chunk_ids
    
    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for a list of texts"""
        if not self.model_loaded:
            raise RuntimeError("Model not initialized. Call initialize() first.")
        
        logger.info(f"Generating embeddings for {len(texts)} texts")
        embeddings = self.model.encode(texts, show_progress_bar=True)
        return embeddings
    
    def process_chunks(self, chunks_to_embed: List[DocumentChunk], source: str) -> Dict[str, int]:
        """Process chunks and generate embeddings for new/changed content"""
        if not chunks_to_embed:
            return {"new_embeddings": 0, "updated_embeddings": 0}
        
        # Extract texts for embedding
        texts = [chunk.content for chunk in chunks_to_embed]
        
        # Generate embeddings
        new_embeddings = self.generate_embeddings(texts)
        
        # Track statistics
        stats = {"new_embeddings": 0, "updated_embeddings": 0}
        
        # Process each chunk
        for i, chunk in enumerate(chunks_to_embed):
            chunk_embedding = new_embeddings[i]
            content_hash = self.compute_content_hash(chunk.content)
            
            if chunk.id in self.metadata:
                # Update existing embedding
                existing_index = self.metadata[chunk.id]['embedding_index']
                self.embeddings[existing_index] = chunk_embedding
                stats["updated_embeddings"] += 1
            else:
                # Add new embedding
                if self.embeddings is None:
                    self.embeddings = np.array([chunk_embedding])
                    embedding_index = 0
                else:
                    self.embeddings = np.vstack([self.embeddings, chunk_embedding])
                    embedding_index = len(self.embeddings) - 1
                
                stats["new_embeddings"] += 1
            
            # Update metadata
            self.metadata[chunk.id] = {
                'chunk_id': chunk.id,
                'embedding_index': embedding_index if chunk.id not in self.metadata else self.metadata[chunk.id]['embedding_index'],
                'source': source,
                'content_hash': content_hash,
                'embedded_at': datetime.now().isoformat(),
                'model_used': EMBEDDING_MODEL
            }
        
        return stats
    
    def remove_deleted_chunks(self, deleted_chunk_ids: List[str]):
        """Remove embeddings and metadata for deleted chunks"""
        if not deleted_chunk_ids:
            return
        
        logger.info(f"Removing {len(deleted_chunk_ids)} deleted chunks")
        
        # Remove from metadata
        for chunk_id in deleted_chunk_ids:
            if chunk_id in self.metadata:
                del self.metadata[chunk_id]
        
        # Note: For simplicity, we're not removing embeddings from the array
        # In a production system, you'd want to rebuild the embeddings array
        # and update all indices in metadata
    
    def save_data(self, chunk_data: List[Dict[str, Any]]):
        """Save embeddings, metadata, and chunk data to disk"""
        try:
            # Ensure data directory exists
            DATA_DIR.mkdir(exist_ok=True)
            
            # Save embeddings
            if self.embeddings is not None:
                np.save(EMBEDDINGS_FILE, self.embeddings)
                logger.info(f"Saved {len(self.embeddings)} embeddings to {EMBEDDINGS_FILE}")
            
            # Save metadata
            metadata_list = list(self.metadata.values())
            with open(METADATA_FILE, 'w') as f:
                json.dump(metadata_list, f, indent=2, default=str)
            logger.info(f"Saved metadata for {len(metadata_list)} chunks")
            
            # Save chunk data
            save_data = {
                "_generated": datetime.now().isoformat(),
                "_total_chunks": len(chunk_data),
                "chunks": chunk_data
            }
            with open(CHUNKS_FILE, 'w') as f:
                json.dump(save_data, f, indent=2)
            logger.info(f"Saved {len(chunk_data)} chunks to {CHUNKS_FILE}")
            
            # Save processing timestamp
            with open(LAST_PROCESSED_FILE, 'w') as f:
                json.dump({
                    "last_processed": datetime.now().isoformat(),
                    "total_chunks": len(chunk_data),
                    "total_embeddings": len(self.embeddings) if self.embeddings is not None else 0
                }, f)
            
        except Exception as e:
            logger.error(f"Failed to save data: {e}")
            raise
    
    def process_upload(self, upload_request: UploadRequest) -> Dict[str, Any]:
        """Main method to process an upload request"""
        start_time = datetime.now()
        
        try:
            # Detect changes
            new_chunks, changed_chunks, deleted_chunk_ids = self.detect_changes(upload_request.chunks)
            
            # Process new and changed chunks
            chunks_to_embed = new_chunks + changed_chunks
            embedding_stats = self.process_chunks(chunks_to_embed, upload_request.source)
            
            # Remove deleted chunks
            self.remove_deleted_chunks(deleted_chunk_ids)
            
            # Update chunk data
            chunk_dict = {chunk.id: chunk.dict() for chunk in upload_request.chunks}
            self.chunk_data = [chunk_dict[chunk_id] for chunk_id in chunk_dict]
            
            # Save everything to disk
            self.save_data(self.chunk_data)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return {
                "success": True,
                "message": f"Successfully processed {len(upload_request.chunks)} chunks",
                "processed_chunks": len(upload_request.chunks),
                "new_embeddings": embedding_stats["new_embeddings"],
                "updated_embeddings": embedding_stats["updated_embeddings"],
                "deleted_chunks": len(deleted_chunk_ids),
                "processing_time": processing_time
            }
            
        except Exception as e:
            logger.error(f"Upload processing failed: {e}")
            return {
                "success": False,
                "message": f"Upload processing failed: {str(e)}",
                "processed_chunks": 0,
                "new_embeddings": 0,
                "updated_embeddings": 0,
                "deleted_chunks": 0,
                "processing_time": (datetime.now() - start_time).total_seconds()
            }
    
    def get_status(self) -> Dict[str, Any]:
        """Get current processing status"""
        return {
            "total_chunks": len(self.chunk_data),
            "embedded_chunks": len(self.metadata),
            "pending_chunks": len(self.chunk_data) - len(self.metadata),
            "last_update": datetime.now().isoformat(),
            "sources": list(set([chunk.get('source_url', '').split('/')[1] for chunk in self.chunk_data if chunk.get('source_url')])),
            "embedding_model": EMBEDDING_MODEL,
            "model_loaded": self.model_loaded,
            "ready": self.model_loaded and len(self.metadata) > 0
        }