/**
 * Create Vertex AI Vector Search Index
 * Run this after your embeddings are generated and stored in Cloud Storage
 */

require('dotenv').config()
const { IndexServiceClient, IndexEndpointServiceClient } =
  require('@google-cloud/aiplatform').v1

// Configuration
const projectId = process.env.GOOGLE_CLOUD_PROJECT
const location = 'us-central1'
const bucketName = process.env.VECTOR_STORAGE_BUCKET

// Find your embeddings file name from the previous script output
const embeddingsFileName = 'embeddings/actions-documentation-2025-08-25.jsonl' // Update this!

async function createVectorSearchIndex() {
  console.log('🚀 Creating Vertex AI Vector Search Index...')

  // Initialize clients
  const indexClient = new IndexServiceClient({
    apiEndpoint: `${location}-aiplatform.googleapis.com`,
  })

  const endpointClient = new IndexEndpointServiceClient({
    apiEndpoint: `${location}-aiplatform.googleapis.com`,
  })

  const parent = `projects/${projectId}/locations/${location}`

  try {
    console.log('📊 Step 1: Creating Vector Index...')

    // Create the index
    const indexRequest = {
      parent,
      index: {
        displayName: 'actions-documentation-index',
        description: 'Semantic search index for Actions documentation',
        metadata: {
          contentsDeltaUri: `gs://${bucketName}/${embeddingsFileName}`,
          config: {
            dimensions: 768, // textembedding-gecko@003 dimensions
            approximateNeighborsCount: 150,
            distanceMeasureType: 'COSINE_DISTANCE',
            algorithmConfig: {
              treeAhConfig: {
                leafNodeEmbeddingCount: 500,
                leafNodesToSearchPercent: 7,
              },
            },
          },
        },
      },
    }

    const [indexOperation] = await indexClient.createIndex(indexRequest)
    console.log('⏳ Index creation started. Waiting for completion...')

    // Wait for index creation (can take 10-30 minutes)
    const [index] = await indexOperation.promise()
    console.log('✅ Index created:', index.name)

    console.log('📊 Step 2: Creating Index Endpoint...')

    // Create an endpoint to deploy the index
    const endpointRequest = {
      parent,
      indexEndpoint: {
        displayName: 'actions-documentation-endpoint',
        description: 'Endpoint for Actions documentation search',
        publicEndpointEnabled: false, // Keep it private
      },
    }

    const [endpointOperation] = await endpointClient.createIndexEndpoint(
      endpointRequest,
    )
    console.log('⏳ Endpoint creation started. Waiting for completion...')

    const [endpoint] = await endpointOperation.promise()
    console.log('✅ Endpoint created:', endpoint.name)

    console.log('📊 Step 3: Deploying Index to Endpoint...')

    // Deploy the index to the endpoint
    const deployRequest = {
      indexEndpoint: endpoint.name,
      deployedIndex: {
        id: 'actions-docs-deployed',
        index: index.name,
        displayName: 'Actions Documentation Search',
        automaticResources: {
          minReplicaCount: 1,
          maxReplicaCount: 1,
        },
      },
    }

    const [deployOperation] = await endpointClient.deployIndex(deployRequest)
    console.log('⏳ Index deployment started. Waiting for completion...')

    const [deployedIndex] = await deployOperation.promise()
    console.log('✅ Index deployed successfully!')

    console.log('\n🎉 Vector Search Setup Complete!')
    console.log('📋 Save these values for your chatbot:')
    console.log(`   INDEX_ENDPOINT: ${endpoint.name}`)
    console.log(`   DEPLOYED_INDEX_ID: actions-docs-deployed`)
    console.log(`   PROJECT_ID: ${projectId}`)
    console.log(`   LOCATION: ${location}`)

    console.log('\n💡 Next steps:')
    console.log('   1. Save the INDEX_ENDPOINT to your environment variables')
    console.log('   2. Build your chatbot query function')
    console.log('   3. Test semantic search queries')

    return {
      indexName: index.name,
      endpointName: endpoint.name,
      deployedIndexId: 'actions-docs-deployed',
    }
  } catch (error) {
    console.error('❌ Error creating vector search setup:', error.message)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  createVectorSearchIndex()
    .then(() => {
      console.log('\n✅ Script completed successfully!')
    })
    .catch(error => {
      console.error('❌ Script failed:', error)
      process.exit(1)
    })
}

module.exports = { createVectorSearchIndex }
