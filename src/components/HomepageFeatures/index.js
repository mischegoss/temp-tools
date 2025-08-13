import React, { useState, useEffect, useRef } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

const combinedStyles = `/* Higher specificity selector targeting button */
html > body > button#ainiro_chat_btn,
html > body > button.ainiro,
html > body > div.ainiro {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  cursor: none !important;
  position: absolute !important;
  width: 0 !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  -webkit-transform: scale(0) !important;
  transform: scale(0) !important;
  z-index: -9999 !important;
}

/* Block all animations */
html > body > button#ainiro_chat_btn,
html > body > button.ainiro,
html > body > div.ainiro,
html > body > button#ainiro_chat_btn *,
html > body > button.ainiro *,
html > body > div.ainiro * {
  animation: none !important;
  transition: none !important;
  -webkit-animation: none !important;
  -moz-animation: none !important;
  -o-animation: none !important;
}

/* Add styles to ensure overlay works properly */
.loading-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background-color: rgb(255, 255, 255) !important;
  transition: opacity 0.8s ease-out !important;
  z-index: 99999 !important;
}

.loading-overlay.fade-out {
  opacity: 0 !important;
}`

const LoadingOverlay = ({ className }) => (
  <div className={`loading-overlay ${className || ''}`} />
)

const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '80px 40px 100px 40px',
  width: '100%',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('lg')]: {
    padding: '60px 32px 80px 32px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '60px 24px 80px 24px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '60px 16px 80px 16px',
  },
}))

const StyledSection = styled('section')(({ theme }) => ({
  background: 'var(--brand-grey-100)',
  minHeight: '60vh',
  width: '100%',
  margin: 0,
  position: 'relative',
  overflow: 'hidden',
  fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
}))

const ProductCard = styled(Box)(({ theme }) => ({
  borderRadius: '16px',
  padding: '32px 20px',
  transition: 'all 0.3s ease',
  border: '2px solid transparent',
  height: '280px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(5, 7, 15, 0.15)',
  fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  cursor: 'pointer',
  textDecoration: 'none !important',
  color: 'inherit',
  textAlign: 'center',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow:
      '0 16px 32px rgba(5, 7, 15, 0.25), 0 0 20px rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textDecoration: 'none !important',
  },
  [theme.breakpoints.down('lg')]: {
    height: '260px',
    padding: '28px 18px',
  },
  [theme.breakpoints.down('md')]: {
    height: '240px',
    padding: '24px 16px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '220px',
    padding: '20px 12px',
  },
}))

const ProductTitle = styled('h3')(({ theme }) => ({
  fontSize: '1.35rem',
  fontWeight: '600',
  color: 'var(--brand-white)',
  marginBottom: '16px',
  lineHeight: '1.3',
  fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  margin: '0 0 16px 0',
  [theme.breakpoints.down('lg')]: {
    fontSize: '1.25rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '1.15rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
  },
}))

const ProductDescription = styled('p')(({ theme }) => ({
  fontSize: '1rem',
  color: 'rgba(255, 255, 255, 0.9)',
  lineHeight: '1.5',
  fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  margin: 0,
  [theme.breakpoints.down('lg')]: {
    fontSize: '0.95rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '0.9rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.85rem',
  },
}))

// Gradient styles matching DocsProducts component
const gradientStyles = {
  express: {
    background:
      'linear-gradient(to bottom, #0f0519 0%, #1a0829 30%, #2d0a4f 70%, #4a1a7a 100%)',
  },
  actions: {
    background:
      'linear-gradient(to bottom, #000511 0%, #001024 30%, #001845 70%, #002b6e 100%)',
  },
  pro: {
    background:
      'linear-gradient(to bottom, #001a0f 0%, #002819 30%, #003d2b 70%, #005c42 100%)',
  },
  insights: {
    background:
      'linear-gradient(to bottom, #001a1f 0%, #002a33 30%, #004454 70%, #006b7a 100%)',
  },
}

const FeatureList = [
  {
    id: 'actions',
    title: 'Resolve Actions Documentation',
    description:
      'Our newest drag-and-drop, no-code IT process automation platform.',
    link: 'https://help.resolve.io/actions',
  },
  {
    id: 'insights',
    title: 'Resolve Insights Documentation',
    description: 'Our Discovery and Dependency Mapping (DDM) product.',
    link: '/insights/',
  },
  {
    id: 'pro',
    title: 'Resolve Actions Pro Documentation',
    description: 'Tailor-made IT automation with powerful code-based features.',
    link: '/pro/',
  },
  {
    id: 'express',
    title: 'Resolve Actions Express Documentation',
    description:
      'Drag-and-drop, no-code IT automation with a large built-in library of automation actions.',
    link: '/express/',
  },
]

function Feature({ id, title, description, link }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <ProductCard
        component='a'
        href={link}
        target={link.startsWith('http') ? '_blank' : '_self'}
        rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
        sx={{
          ...gradientStyles[id],
          width: '100%',
        }}
      >
        <ProductTitle>{title}</ProductTitle>
        <ProductDescription>{description}</ProductDescription>
      </ProductCard>
    </Grid>
  )
}

export default function HomepageFeatures() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const styleRef = useRef(null)

  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement('style')
      styleRef.current.textContent = combinedStyles
      document.head.insertBefore(styleRef.current, document.head.firstChild)
    }

    requestAnimationFrame(() => {
      setMounted(true)
      const hasSeen = localStorage.getItem('hasSeenHomepageFade')

      if (!hasSeen) {
        localStorage.setItem('hasSeenHomepageFade', 'true')
        setTimeout(() => setShowContent(true), 100)
        requestAnimationFrame(() => {
          setTimeout(() => {
            setIsFading(true)
            setTimeout(() => setIsLoading(false), 600)
          }, 800)
        })
      } else {
        setIsLoading(false)
        setShowContent(true)
      }
    })

    return () => styleRef.current?.remove()
  }, [])

  if (!mounted) return null

  return (
    <>
      {isLoading && <LoadingOverlay className={isFading ? 'fade-out' : ''} />}
      {showContent && (
        <StyledSection>
          <StyledContainer>
            <Grid
              container
              spacing={2.5}
              sx={{
                maxWidth: '1200px',
                margin: '0 auto',
                justifyContent: 'center',
              }}
            >
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </Grid>
          </StyledContainer>
        </StyledSection>
      )}
    </>
  )
}
