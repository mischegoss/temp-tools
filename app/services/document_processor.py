import json
import numpy as np
import hashlib
import os
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from sentence_transformers import SentenceTransformer
import logging

from app.config import EMBEDDING_MODEL, EMBEDDING_DIMENSION
from app.models.upload import DocumentChunk, UploadRequest
from app.models.metadata import EmbeddingMetadata
from app.services.storage_service import CloudStorageService

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.model = None
        self.embeddings = None
        self.metadata = {}
        self.chunk_data = []
        self.page_mappings = {}  # New: store page mappings from comprehensive JSON
        self.documentation_stats = {}  # New: store documentation statistics
        self.model_loaded = False
        
        # Initialize Cloud Storage
        bucket_name = os.getenv('STORAGE_BUCKET_NAME', 'actions-chatbot-data-bucket')
        self.storage = CloudStorageService(bucket_name)
        
    def initialize(self, shared_model: Optional[SentenceTransformer] = None):
        """
        Initialize the sentence transformer model and load existing data
        
        Args:
            shared_model: Pre-loaded SentenceTransformer model to share (optional)
        """
        try:
            if shared_model is not None:
                # Use the pre-loaded model from main app (memory optimization)
                logger.info("Using shared sentence transformer model from main application")
                self.model = shared_model
                self.model_loaded = True
            else:
                # Fallback: load model independently (for standalone usage)
                logger.info(f"Loading embedding model independently: {EMBEDDING_MODEL}")
                self.model = SentenceTransformer(EMBEDDING_MODEL)
                self.model_loaded = True
                logger.info("Embedding model loaded successfully")
            
            # Initialize storage service
            self.storage.initialize()
            
            # Load existing data from Cloud Storage
            self.load_existing_data()
            
        except Exception as e:
            logger.error(f"Failed to initialize document processor: {e}")
            raise
    
    def load_existing_data(self):
        """Load existing embeddings and comprehensive data from Cloud Storage"""
        try:
            # Load embeddings if they exist
            self.embeddings = self.storage.load_embeddings("embeddings.npy")
            if self.embeddings is not None:
                logger.info(f"Loaded {len(self.embeddings)} existing embeddings from Cloud Storage")
            
            # Load metadata if it exists
            metadata_list = self.storage.load_json("metadata.json")
            if metadata_list is not None:
                self.metadata = {item['chunk_id']: item for item in metadata_list}
                logger.info(f"Loaded metadata for {len(self.metadata)} chunks from Cloud Storage")
            
            # Load comprehensive chunk data if it exists
            comprehensive_data = self.storage.load_json("documentation-chunks.json")
            if comprehensive_data is not None:
                # Extract chunks from comprehensive structure
                self.chunk_data = comprehensive_data.get('chunks', [])
                
                # Extract page mappings if available
                self.page_mappings = comprehensive_data.get('_PAGE_MAPPINGS', {})
                
                # Extract documentation statistics
                self.documentation_stats = comprehensive_data.get('_STATS', {})
                
                logger.info(f"Loaded {len(self.chunk_data)} chunks from comprehensive JSON")
                logger.info(f"Loaded {len(self.page_mappings)} page mappings")
                
                # Log enhanced features if available
                enhanced_features = comprehensive_data.get('_ENHANCED_FEATURES', [])
                if enhanced_features:
                    logger.info(f"Available enhanced features: {', '.join(enhanced_features)}")
            
            if len(self.chunk_data) == 0:
                logger.info("No existing data found in Cloud Storage - starting fresh")
                
        except Exception as e:
            logger.warning(f"Could not load existing data from Cloud Storage: {e}")
            self.embeddings = None
            self.metadata = {}
            self.chunk_data = []
            self.page_mappings = {}
            self.documentation_stats = {}
    
    def compute_content_hash(self, content: str) -> str:
        """Compute SHA-256 hash of content for change detection"""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
    
    def parse_comprehensive_json(self, json_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parse the comprehensive JSON structure and extract chunks"""
        try:
            # Validate comprehensive JSON structure
            required_fields = ['chunks', '_GENERATED', '_TOTAL_CHUNKS']
            for field in required_fields:
                if field not in json_data:
                    raise ValueError(f"Missing required field in comprehensive JSON: {field}")
            
            # Extract chunks
            chunks = json_data.get('chunks', [])
            
            # Validate chunk count
            expected_count = json_data.get('_TOTAL_CHUNKS', 0)
            if len(chunks) != expected_count:
                logger.warning(f"Chunk count mismatch: expected {expected_count}, got {len(chunks)}")
            
            # Store additional data
            self.page_mappings = json_data.get('_PAGE_MAPPINGS', {})
            self.documentation_stats = json_data.get('_STATS', {})
            
            # Log comprehensive JSON metadata
            logger.info(f"Processed comprehensive JSON generated at: {json_data.get('_GENERATED', 'unknown')}")
            logger.info(f"Variable substitutions applied: {len(json_data.get('_VARIABLE_SUBSTITUTIONS', {}))}")
            
            enhanced_features = json_data.get('_ENHANCED_FEATURES', [])
            if enhanced_features:
                logger.info(f"Enhanced features: {', '.join(enhanced_features)}")
            
            return chunks
            
        except Exception as e:
            logger.error(f"Failed to parse comprehensive JSON: {e}")
            raise
    
    def detect_changes(self, new_chunks_data: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[str]]:
        """
        Detect what's new, changed, or deleted
        Returns: (new_chunks, changed_chunks, deleted_chunk_ids)
        """
        new_chunks_list = []
        changed_chunks_list = []
        current_chunk_ids = set()
        
        for chunk_data in new_chunks_data:
            chunk_id = chunk_data.get('id')
            if not chunk_id:
                logger.warning("Chunk missing ID, skipping")
                continue
                
            current_chunk_ids.add(chunk_id)
            content_hash = self.compute_content_hash(chunk_data.get('content', ''))
            
            if chunk_id not in self.metadata:
                # New chunk
                new_chunks_list.append(chunk_data)
            elif self.metadata[chunk_id].get('content_hash') != content_hash:
                # Changed chunk
                changed_chunks_list.append(chunk_data)
        
        # Find deleted chunks
        existing_chunk_ids = set(self.metadata.keys())
        deleted_chunk_ids = list(existing_chunk_ids - current_chunk_ids)
        
        logger.info(f"Change detection: {len(new_chunks_list)} new, {len(changed_chunks_list)} changed, {len(deleted_chunk_ids)} deleted")
        
        return new_chunks_list, changed_chunks_list, deleted_chunk_ids
    
    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for a list of texts"""
        if not self.model_loaded:
            raise RuntimeError("Model not initialized. Call initialize() first.")
        
        logger.info(f"Generating embeddings for {len(texts)} texts")
        embeddings = self.model.encode(texts, show_progress_bar=True)
        return embeddings
    
    def process_chunks(self, chunks_to_embed: List[Dict[str, Any]], source: str) -> Dict[str, int]:
        """Process chunks and generate embeddings for new/changed content"""
        if not chunks_to_embed:
            return {"new_embeddings": 0, "updated_embeddings": 0}
        
        # Extract texts for embedding (prioritize content over original_content)
        texts = []
        for chunk_data in chunks_to_embed:
            content = chunk_data.get('content', '')
            if not content:
                # Fallback to original_content if content is missing
                content = chunk_data.get('original_content', '')
            texts.append(content)
        
        # Generate embeddings
        new_embeddings = self.generate_embeddings(texts)
        
        # Track statistics
        stats = {"new_embeddings": 0, "updated_embeddings": 0}
        
        # Process each chunk
        for i, chunk_data in enumerate(chunks_to_embed):
            chunk_id = chunk_data.get('id')
            if not chunk_id:
                continue
                
            chunk_embedding = new_embeddings[i]
            content_hash = self.compute_content_hash(chunk_data.get('content', ''))
            
            if chunk_id in self.metadata:
                # Update existing embedding
                existing_index = self.metadata[chunk_id]['embedding_index']
                self.embeddings[existing_index] = chunk_embedding
                stats["updated_embeddings"] += 1
                embedding_index = existing_index
            else:
                # Add new embedding
                if self.embeddings is None:
                    self.embeddings = np.array([chunk_embedding])
                    embedding_index = 0
                else:
                    self.embeddings = np.vstack([self.embeddings, chunk_embedding])
                    embedding_index = len(self.embeddings) - 1
                
                stats["new_embeddings"] += 1
            
            # Update metadata with enhanced information
            self.metadata[chunk_id] = {
                'chunk_id': chunk_id,
                'embedding_index': embedding_index,
                'source': source,
                'content_hash': content_hash,
                'embedded_at': datetime.now().isoformat(),
                'model_used': EMBEDDING_MODEL,
                # Store enhanced metadata flags for quick access
                'has_code': chunk_data.get('metadata', {}).get('has_code', False),
                'has_tables': chunk_data.get('metadata', {}).get('has_tables', False),
                'has_relationships': bool(chunk_data.get('metadata', {}).get('directory_relationships', {}).get('relationship_counts', {}).get('total_related', 0)),
                'content_type': chunk_data.get('content_type', {}),
                'complexity': chunk_data.get('complexity', 'unknown')
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
    
    def save_data(self, comprehensive_data: Dict[str, Any]):
        """Save embeddings, metadata, and comprehensive data to Cloud Storage"""
        try:
            # Save embeddings
            if self.embeddings is not None:
                success = self.storage.save_embeddings(self.embeddings, "embeddings.npy")
                if success:
                    logger.info(f"Saved {len(self.embeddings)} embeddings to Cloud Storage")
                else:
                    raise RuntimeError("Failed to save embeddings to Cloud Storage")
            
            # Save metadata
            metadata_list = list(self.metadata.values())
            success = self.storage.save_json(metadata_list, "metadata.json")
            if success:
                logger.info(f"Saved metadata for {len(metadata_list)} chunks to Cloud Storage")
            else:
                raise RuntimeError("Failed to save metadata to Cloud Storage")
            
            # Save comprehensive data (preserving all original fields)
            success = self.storage.save_json(comprehensive_data, "documentation-chunks.json")
            if success:
                chunks_count = len(comprehensive_data.get('chunks', []))
                logger.info(f"Saved comprehensive JSON with {chunks_count} chunks to Cloud Storage")
            else:
                raise RuntimeError("Failed to save comprehensive data to Cloud Storage")
            
            # Save processing timestamp
            processing_info = {
                "last_processed": datetime.now().isoformat(),
                "total_chunks": len(comprehensive_data.get('chunks', [])),
                "total_embeddings": len(self.embeddings) if self.embeddings is not None else 0,
                "page_mappings_count": len(self.page_mappings),
                "enhanced_features": comprehensive_data.get('_ENHANCED_FEATURES', [])
            }
            self.storage.save_json(processing_info, "last-processed.json")
            
        except Exception as e:
            logger.error(f"Failed to save data to Cloud Storage: {e}")
            raise
    
    def process_comprehensive_upload(self, comprehensive_data: Dict[str, Any], source: str = "comprehensive_json") -> Dict[str, Any]:
        """Main method to process a comprehensive JSON upload"""
        start_time = datetime.now()
        
        try:
            # Parse comprehensive JSON structure
            chunks_data = self.parse_comprehensive_json(comprehensive_data)
            
            # Update chunk data
            self.chunk_data = chunks_data
            
            # Detect changes
            new_chunks, changed_chunks, deleted_chunk_ids = self.detect_changes(chunks_data)
            
            # Process new and changed chunks
            chunks_to_embed = new_chunks + changed_chunks
            embedding_stats = self.process_chunks(chunks_to_embed, source)
            
            # Remove deleted chunks
            self.remove_deleted_chunks(deleted_chunk_ids)
            
            # Save everything to Cloud Storage
            self.save_data(comprehensive_data)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            # Enhanced response with comprehensive data info
            return {
                "success": True,
                "message": f"Successfully processed comprehensive JSON with {len(chunks_data)} chunks",
                "processed_chunks": len(chunks_data),
                "new_embeddings": embedding_stats["new_embeddings"],
                "updated_embeddings": embedding_stats["updated_embeddings"],
                "deleted_chunks": len(deleted_chunk_ids),
                "page_mappings": len(self.page_mappings),
                "enhanced_features": comprehensive_data.get('_ENHANCED_FEATURES', []),
                "variable_substitutions": len(comprehensive_data.get('_VARIABLE_SUBSTITUTIONS', {})),
                "processing_time": processing_time
            }
            
        except Exception as e:
            logger.error(f"Comprehensive upload processing failed: {e}")
            return {
                "success": False,
                "message": f"Comprehensive upload processing failed: {str(e)}",
                "processed_chunks": 0,
                "new_embeddings": 0,
                "updated_embeddings": 0,
                "deleted_chunks": 0,
                "processing_time": (datetime.now() - start_time).total_seconds()
            }
    
    def process_upload(self, upload_request: UploadRequest) -> Dict[str, Any]:
        """Legacy method for backwards compatibility - converts to chunk data format"""
        start_time = datetime.now()
        
        try:
            # Convert UploadRequest chunks to chunk data format
            chunks_data = [chunk.dict() for chunk in upload_request.chunks]
            
            # Detect changes
            new_chunks, changed_chunks, deleted_chunk_ids = self.detect_changes(chunks_data)
            
            # Process new and changed chunks
            chunks_to_embed = new_chunks + changed_chunks
            embedding_stats = self.process_chunks(chunks_to_embed, upload_request.source)
            
            # Remove deleted chunks
            self.remove_deleted_chunks(deleted_chunk_ids)
            
            # Update chunk data
            self.chunk_data = chunks_data
            
            # Create simple comprehensive data structure for storage
            simple_comprehensive_data = {
                "_generated": datetime.now().isoformat(),
                "_total_chunks": len(chunks_data),
                "chunks": chunks_data
            }
            
            # Save everything to Cloud Storage
            self.save_data(simple_comprehensive_data)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return {
                "success": True,
                "message": f"Successfully processed {len(upload_request.chunks)} chunks and saved to Cloud Storage",
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
        """Get current processing status with enhanced information"""
        return {
            "total_chunks": len(self.chunk_data),
            "embedded_chunks": len(self.metadata),
            "pending_chunks": len(self.chunk_data) - len(self.metadata),
            "page_mappings": len(self.page_mappings),
            "last_update": datetime.now().isoformat(),
            "sources": list(set([chunk.get('source_url', '').split('/')[1] for chunk in self.chunk_data if chunk.get('source_url')])),
            "embedding_model": EMBEDDING_MODEL,
            "model_loaded": self.model_loaded,
            "ready": self.model_loaded and len(self.metadata) > 0,
            "documentation_stats": self.documentation_stats,
            "enhanced_features_available": len(self.documentation_stats) > 0
        }