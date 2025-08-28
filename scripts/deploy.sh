#!/bin/bash

# Deploy script with warmup functionality
PROJECT_ID="actions-chatbot-470114"
SERVICE_NAME="actions-chatbot-api"
REGION="us-central1"

echo "🚀 Starting deployment to Cloud Run..."

# Set the project
gcloud config set project $PROJECT_ID

# Deploy to Cloud Run
echo "📦 Building and deploying container..."
gcloud run deploy $SERVICE_NAME \
  --source=. \
  --region=$REGION \
  --allow-unauthenticated \
  --memory=2Gi \
  --cpu=1 \
  --timeout=300 \
  --max-instances=10 \
  --min-instances=0 \
  --concurrency=100

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
    echo "🌐 Service URL: $SERVICE_URL"
    
    # Wait a moment for the service to be fully ready
    echo "⏳ Waiting for service to be ready..."
    sleep 10
    
    # Test health endpoint
    echo "🔍 Testing health endpoint..."
    curl -s "$SERVICE_URL/health" | jq '.' || echo "Health check response received (jq not available for formatting)"
    
    # Warmup the service
    echo "🔥 Warming up the service..."
    curl -s "$SERVICE_URL/warmup" | jq '.' || echo "Warmup response received (jq not available for formatting)"
    
    # Test status endpoint
    echo "📊 Checking detailed status..."
    curl -s "$SERVICE_URL/status" | jq '.' || echo "Status response received (jq not available for formatting)"
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "Service is now ready at: $SERVICE_URL"
    echo ""
    echo "Available endpoints:"
    echo "  Health: $SERVICE_URL/health"
    echo "  Warmup: $SERVICE_URL/warmup"
    echo "  Status: $SERVICE_URL/status"
    echo "  Search: $SERVICE_URL/search (POST)"
    echo "  Chat: $SERVICE_URL/chat (POST)"
    echo ""
    echo "🧪 Test with curl:"
    echo "  curl $SERVICE_URL/health"
    echo "  curl $SERVICE_URL/warmup"
    
else
    echo "❌ Deployment failed!"
    exit 1
fi