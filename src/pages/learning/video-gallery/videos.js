// @site/src/pages/learning/video-gallery/videos.js

import React, { useEffect, useState } from 'react'
import { useLocation } from '@docusaurus/router'
import Layout from '@theme/Layout'
import VideoLandingPage from '../../../components/ActionsVideo/VideoLandingPage.js'
import { videoLibrary } from '../../../components/ActionVideoLibrary/Data/VideoData.js'

/**
 * Catch-all video page that handles all video routes
 * URL format: /learning/video-gallery/videos?video=video-id
 */
export default function VideosPage() {
  console.log('=== VideosPage COMPONENT LOADING ===')

  const location = useLocation()
  const [videoData, setVideoData] = useState(null)

  console.log('Location object:', location)
  console.log('Location.search:', location.search)
  console.log(
    'videoLibrary loaded:',
    !!videoLibrary,
    'Length:',
    videoLibrary?.length,
  )

  useEffect(() => {
    console.log('=== useEffect running ===')
    // Get video ID from URL query parameter
    const urlParams = new URLSearchParams(location.search)
    const videoId = urlParams.get('video')

    console.log('Parsed videoId from URL:', videoId)

    if (videoId) {
      const video = videoLibrary.find(v => v.id === videoId)
      console.log('Found video:', !!video)
      if (video) {
        console.log('Video data:', video)
        console.log('Video template:', video.template)
      } else {
        console.log(
          'Video not found. Available IDs:',
          videoLibrary.map(v => v.id),
        )
      }
      setVideoData(video)
    } else {
      console.log('No videoId in URL parameters')
    }
  }, [location.search])

  console.log('About to render VideoLandingPage with videoData:', !!videoData)

  // VideoLandingPage already includes Layout, so we don't need to wrap it
  return <VideoLandingPage videoData={videoData} />
}
