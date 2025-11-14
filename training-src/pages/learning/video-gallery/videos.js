// @site/src/pages/learning/video-gallery/videos.js
// UPDATED: Now uses Firebase for individual video lookup

import React, { useEffect, useState } from 'react'
import { useLocation } from '@docusaurus/router'
import Layout from '@theme/Layout'
import VideoLandingPage from '../../../components/ActionsVideo/VideoLandingPage.js'
import { getVideoByCustomId } from '../../../firebase/videoOperations.js'

/**
 * Catch-all video page that handles all video routes
 * URL format: /learning/video-gallery/videos?video=video-id
 * UPDATED: Now fetches video data from Firebase instead of static array
 */
export default function VideosPage() {
  console.log('=== VideosPage COMPONENT LOADING (Firebase Version) ===')

  const location = useLocation()
  const [videoData, setVideoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  console.log('Location object:', location)
  console.log('Location.search:', location.search)

  useEffect(() => {
    console.log('=== useEffect running (Firebase lookup) ===')

    const loadVideoFromFirebase = async () => {
      setLoading(true)
      setError(null)

      // Get video ID from URL query parameter
      const urlParams = new URLSearchParams(location.search)
      const videoId = urlParams.get('video')

      console.log('Parsed videoId from URL:', videoId)

      if (!videoId) {
        console.log('No videoId in URL parameters')
        setError('No video ID provided')
        setLoading(false)
        return
      }

      try {
        // Fetch video from Firebase using custom ID
        console.log('🔍 Fetching video from Firebase:', videoId)
        const result = await getVideoByCustomId(videoId)

        if (result.success && result.data) {
          console.log('✅ Video loaded from Firebase:', result.data.title)
          console.log('Video template:', result.data.template)
          console.log('Video data:', result.data)
          setVideoData(result.data)
          setError(null)
        } else {
          console.log('❌ Video not found in Firebase:', videoId)
          console.log('Error:', result.error)
          setError(`Video "${videoId}" not found`)
          setVideoData(null)
        }
      } catch (err) {
        console.error('🚨 Error fetching video from Firebase:', err)
        setError('Failed to load video')
        setVideoData(null)
      }

      setLoading(false)
    }

    loadVideoFromFirebase()
  }, [location.search])

  // Show loading state
  if (loading) {
    return (
      <Layout title='Loading Video...' description='Loading video content'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #0066FF',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px',
              }}
            />
            <h2>Loading Video...</h2>
            <p>Fetching video data from Firebase...</p>
            <style jsx>{`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        </div>
      </Layout>
    )
  }

  // Show error state
  if (error) {
    return (
      <Layout title='Video Not Found' description='Video content not available'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div>
            <h1>Video Not Found</h1>
            <p style={{ color: '#e53e3e', marginBottom: '20px' }}>{error}</p>
            <p>
              The video you're looking for might have been moved or doesn't
              exist.
            </p>
            <a
              href='/learning/video-gallery'
              style={{
                color: '#0066FF',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 20px',
                border: '2px solid #0066FF',
                borderRadius: '6px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={e => {
                e.target.style.backgroundColor = '#0066FF'
                e.target.style.color = '#FFFFFF'
              }}
              onMouseOut={e => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = '#0066FF'
              }}
            >
              ← Back to Video Gallery
            </a>
          </div>
        </div>
      </Layout>
    )
  }

  // Show video content (videoData exists)
  console.log(
    'About to render VideoLandingPage with Firebase videoData:',
    !!videoData,
  )

  // VideoLandingPage already includes Layout, so we don't need to wrap it
  return <VideoLandingPage videoData={videoData} />
}
