#!/bin/bash

# Deploy script for Express Chatbot API
PROJECT_ID="express-chatbot"
SERVICE_NAME="express-chatbot-api"
REGION="us-central1"

echo "🚀 Starting Express API deployment to Cloud Run..."

# Set the project
gcloud config set project $PROJECT_ID

# Deploy to Cloud Run
echo "📦 Building and deploying Express container..."
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
    echo "✅ Express API deployment successful!"
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
    echo "🌐 Express API Service URL: $SERVICE_URL"
    
    # Wait a moment for the service to be fully ready
    echo "⏳ Waiting for Express service to be ready..."
    sleep 10
    
    # Test health endpoint
    echo "🔍 Testing Express health endpoint..."
    curl -s "$SERVICE_URL/health" | jq '.' || echo "Express health check response received (jq not available for formatting)"
    
    # Warmup the Express service
    echo "🔥 Warming up the Express service..."
    curl -s "$SERVICE_URL/warmup" | jq '.' || echo "Express warmup response received (jq not available for formatting)"
    
    # Test Express status endpoint
    echo "📊 Checking detailed Express status..."
    curl -s "$SERVICE_URL/status" | jq '.' || echo "Express status response received (jq not available for formatting)"
    
    # Test Express root endpoint
    echo "🏠 Testing Express root endpoint..."
    curl -s "$SERVICE_URL/" | jq '.' || echo "Express root response received (jq not available for formatting)"
    
    echo ""
    echo "🎉 Express API deployment completed successfully!"
    echo "Express service is now ready at: $SERVICE_URL"
    echo ""
    echo "Available Express endpoints:"
    echo "  Root: $SERVICE_URL/"
    echo "  Health: $SERVICE_URL/health"
    echo "  Warmup: $SERVICE_URL/warmup"
    echo "  Status: $SERVICE_URL/status"
    echo "  Chat: $SERVICE_URL/api/v1/chat (POST)"
    echo "  Search: $SERVICE_URL/api/v1/search (POST)"
    echo "  Upload: $SERVICE_URL/api/v1/upload-documentation (POST)"
    echo ""
    echo "🧪 Test Express API with curl:"
    echo "  curl $SERVICE_URL/health"
    echo "  curl $SERVICE_URL/warmup"
    echo ""
    echo "💬 Test Express chat endpoint:"
    echo "  curl -X POST $SERVICE_URL/api/v1/chat \\"
    echo "    -H \"Content-Type: application/json\" \\"
    echo "    -d '{\"message\": \"How do I create an Express workflow?\", \"product\": \"express\", \"version\": \"on-premise-2-5\"}'"
    
else
    echo "❌ Express API deployment failed!"
    exit 1
fi