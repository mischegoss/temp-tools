function getProductFromUrl() {
  const url = window.location.href
    .replace('http://', '')
    .replace('https://', '')
  const segments = url.split('/')

  if (segments.length > 1) {
    // Check for simple paths first
    switch (segments[1]) {
      case 'express':
        return 'Express'
      case 'actions':
        return 'Actions'
      case 'pro':
        return 'Pro'
      case 'insights':
        return 'Insights'
      case 'express-saas':
        return 'Express SaaS'
      case 'enterprise':
        return 'Enterprise'
      case 'starter':
        return 'Starter'
      case 'team':
        return 'Team'
      // Check for learning paths
      case 'learning':
        if (segments.length > 2) {
          switch (segments[2]) {
            case 'service-blueprinting':
              return 'Service Blueprinting'
            case 'automation-essentials':
              return 'Automation Essentials'
          }
        }
        break
    }
  }

  return null
}

function updateTitle() {
  const productName = getProductFromUrl()

  if (productName) {
    const currentTitle = document.title

    // Check if title has already been updated (contains the product name between pipes)
    const productPattern = new RegExp(
      `\\| ${productName} \\| Resolve Documentation`,
    )

    if (!productPattern.test(currentTitle)) {
      // Only update if it hasn't been updated yet
      const newTitle = currentTitle.replace(
        '| Resolve Documentation',
        `| ${productName} | Resolve Documentation`,
      )

      document.title = newTitle
      console.log('Updated title:', document.title)
    } else {
      console.log('Title already updated:', document.title)
    }
  } else {
    console.log('No product detected for URL:', window.location.href)
  }
}

// Execute on initial load
if (typeof window !== 'undefined') {
  // Wait for DOM and title to be set
  setTimeout(updateTitle, 500)

  // Handle Docusaurus route changes
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  history.pushState = function () {
    originalPushState.apply(history, arguments)
    setTimeout(updateTitle, 100)
  }

  history.replaceState = function () {
    originalReplaceState.apply(history, arguments)
    setTimeout(updateTitle, 100)
  }

  // Handle popstate (back/forward buttons)
  window.addEventListener('popstate', () => {
    setTimeout(updateTitle, 100)
  })
}
