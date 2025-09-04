#!/bin/bash

# Deploy script for Actions Chatbot API
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
  --memory=4Gi \
  --cpu=1 \
  --timeout=900 \
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
    
    # Test root endpoint
    echo "🏠 Testing root endpoint..."
    curl -s "$SERVICE_URL/" | jq '.' || echo "Root response received (jq not available for formatting)"
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "Service is now ready at: $SERVICE_URL"
    echo ""
    echo "Available endpoints:"
    echo "  Root: $SERVICE_URL/"
    echo "  Health: $SERVICE_URL/health"
    echo "  Chat: $SERVICE_URL/api/v1/chat (POST)"
    echo "  Search: $SERVICE_URL/api/v1/search (POST)"
    echo ""
    echo "🧪 Test with curl:"
    echo "  curl $SERVICE_URL/health"
    echo "  curl $SERVICE_URL/"
    echo ""
    echo "💬 Test chat endpoint:"
    echo "  curl -X POST $SERVICE_URL/api/v1/chat \\"
    echo "    -H \"Content-Type: application/json\" \\"
    echo "    -d '{\"message\": \"How do I create a workflow?\", \"conversation_id\": \"test-123\"}'"
    
else
    echo "❌ Deployment failed!"
    exit 1
fi