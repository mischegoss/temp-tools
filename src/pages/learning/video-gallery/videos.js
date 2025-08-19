// @site/src/pages/learning/actions-videos/videos.js
// This file should REPLACE the entire videos/ folder

import React, { useEffect, useState } from 'react'
import { useLocation } from '@docusaurus/router'
import Layout from '@theme/Layout'
import VideoLandingPage from '../../../components/ActionsVideo/VideoLandingPage.js'
import { videoLibrary } from '../../../components/ActionVideoLibrary/Data/VideoData.js'

/**
 * Catch-all video page that handles all video routes
 * URL format: /learning/actions-videos/videos?video=video-id
 */
export default function VideosPage() {
  const location = useLocation()
  const [videoData, setVideoData] = useState(null)

  useEffect(() => {
    // Get video ID from URL query parameter
    const urlParams = new URLSearchParams(location.search)
    const videoId = urlParams.get('video')

    if (videoId) {
      const video = videoLibrary.find(v => v.id === videoId)
      setVideoData(video)
    }
  }, [location.search])

  // VideoLandingPage already includes Layout, so we don't need to wrap it
  return <VideoLandingPage videoData={videoData} />
}
