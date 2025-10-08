export const getEmbedUrl = (videoId, platform, vimeoHash = null) => {
  if (platform === 'vimeo') {
    const hashParam = vimeoHash ? `h=${vimeoHash}&` : ''
    return `https://player.vimeo.com/video/${videoId}?${hashParam}badge=0&autopause=0&player_id=0&app_id=58479`
  }
  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`
}
