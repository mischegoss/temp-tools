#!/bin/bash

# Deploy script for Pro Chatbot API
PROJECT_ID="pro-chatbot-470114"
SERVICE_NAME="pro-chatbot-api"
REGION="us-central1"

echo "🚀 Starting Pro API deployment to Cloud Run..."

# Set the project
gcloud config set project $PROJECT_ID

# Deploy to Cloud Run
echo "📦 Building and deploying Pro container..."
gcloud run deploy $SERVICE_NAME \
  --source=. \
  --region=$REGION \
  --allow-unauthenticated \
  --memory=4Gi \
  --cpu=1 \
  --timeout=900 \
  --max-instances=10 \
  --min-instances=0 \
  --concurrency=100

if [ $? -eq 0 ]; then
    echo "✅ Pro API deployment successful!"
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
    echo "🌐 Pro API Service URL: $SERVICE_URL"
    
    # Wait a moment for the service to be fully ready
    echo "⏳ Waiting for Pro service to be ready..."
    sleep 10
    
    # Test health endpoint
    echo "🔍 Testing Pro health endpoint..."
    curl -s "$SERVICE_URL/health" | jq '.' || echo "Pro health check response received (jq not available for formatting)"
    
    # Warmup the Pro service
    echo "🔥 Warming up the Pro service..."
    curl -s "$SERVICE_URL/warmup" | jq '.' || echo "Pro warmup response received (jq not available for formatting)"
    
    # Test Pro status endpoint
    echo "📊 Checking detailed Pro status..."
    curl -s "$SERVICE_URL/status" | jq '.' || echo "Pro status response received (jq not available for formatting)"
    
    # Test Pro root endpoint
    echo "🏠 Testing Pro root endpoint..."
    curl -s "$SERVICE_URL/" | jq '.' || echo "Pro root response received (jq not available for formatting)"
    
    echo ""
    echo "🎉 Pro API deployment completed successfully!"
    echo "Pro service is now ready at: $SERVICE_URL"
    echo ""
    echo "Available Pro endpoints:"
    echo "  Root: $SERVICE_URL/"
    echo "  Health: $SERVICE_URL/health"
    echo "  Warmup: $SERVICE_URL/warmup"
    echo "  Status: $SERVICE_URL/status"
    echo "  Chat: $SERVICE_URL/api/v1/chat (POST)"
    echo "  Search: $SERVICE_URL/api/v1/search (POST)"
    echo "  Upload: $SERVICE_URL/api/v1/upload-documentation (POST)"
    echo ""
    echo "🧪 Test Pro API with curl:"
    echo "  curl $SERVICE_URL/health"
    echo "  curl $SERVICE_URL/warmup"
    echo ""
    echo "💬 Test Pro chat endpoint:"
    echo "  curl -X POST $SERVICE_URL/api/v1/chat \\"
    echo "    -H \"Content-Type: application/json\" \\"
    echo "    -d '{\"message\": \"How do I create a Pro workflow?\", \"product\": \"pro\", \"version\": \"8-0\"}'"
    
else
    echo "❌ Pro API deployment failed!"
    exit 1
fi