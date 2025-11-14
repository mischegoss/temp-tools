import React, { useState, useEffect, useRef } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
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
  padding: '4rem 0',
  maxWidth: '1200px',
  margin: '0 auto',
}))

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  height: '280px',
  transition: 'all 0.3s ease-in-out',
  border: '1px solid #0A192F',
  borderRadius: '12px',
  cursor: 'pointer',
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  padding: '2.4rem 1.6rem',
  position: 'relative',
  boxShadow: '0 2px 8px rgba(14, 190, 190, 0.1)',
  margin: 0,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(14, 190, 190, 0.2)',
    borderColor: '#0ebebe',
    textDecoration: 'none',
    '& .feature-svg': {
      transform: 'scale(1.05)',
    },
  },
  [theme.breakpoints.down('md')]: {
    height: '240px',
    padding: '1.2rem',
    maxWidth: '320px',
  },
}))

const ImageContainer = styled(Box)(({ theme }) => ({
  height: '96px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '2.4rem',
  backgroundColor: '#ffffff',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    height: '80px',
    marginBottom: '1.6rem',
  },
}))

const FeatureSvg = styled('div')(({ theme }) => ({
  width: 'auto',
  transition: 'transform 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: 'auto',
    objectFit: 'contain',
  },
  '&.expressLogo svg': {
    height: '52px',
    maxWidth: '224px',
    [theme.breakpoints.down('md')]: {
      height: '36px',
      maxWidth: '160px',
    },
  },
  '&.actionsLogo svg': {
    height: '68px',
    maxWidth: '240px',
    marginTop: '-8px',
    [theme.breakpoints.down('md')]: {
      height: '52px',
      maxWidth: '176px',
      marginTop: '-5px',
    },
  },
  '&.proLogo svg': {
    height: '44px',
    maxWidth: '192px',
    [theme.breakpoints.down('md')]: {
      height: '28px',
      maxWidth: '128px',
    },
  },
  '&.insightsLogo svg': {
    height: '44px',
    maxWidth: '192px',
    [theme.breakpoints.down('md')]: {
      height: '28px',
      maxWidth: '128px',
    },
  },
}))

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  margin: '0 0 1.2rem 0',
  fontWeight: 600,
  lineHeight: 1.3,
  color: '#2c3345',
  textAlign: 'center',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
    height: '2.6rem',
    marginBottom: '1rem',
  },
}))

const CardDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: '#6c757d',
  textAlign: 'center',
  lineHeight: 1.5,
  padding: '0 0.8rem',
  margin: 0,
  [theme.breakpoints.down('md')]: {
    fontSize: '0.9rem',
  },
}))

const FeatureList = [
  {
    title: 'Resolve Actions Express Documentation',
    Svg: require('@site/static/img/Resolve-Actions-Express-Dark.svg').default,
    description:
      'Drag-and-drop, no-code IT automation with a large built-in library of automation actions.',
    link: '/express/',
    imageClass: 'expressLogo',
  },
  {
    title: 'Resolve Actions Documentation',
    Svg: require('@site/static/img/Resolve-Actions.svg').default,
    description:
      'Our newest drag-and-drop, no-code IT process automation platform.',
    link: '/actions/',
    imageClass: 'actionsLogo',
  },
  {
    title: 'Resolve Actions Pro Documentation',
    Svg: require('@site/static/img/Resolve-Actions-Pro-Dark.svg').default,
    description: 'Tailor-made IT automation with powerful code-based features.',
    link: '/pro/',
    imageClass: 'proLogo',
  },
  {
    title: 'Resolve Insights Documentation',
    Svg: require('@site/static/img/Resolve-Insights-Dark.svg').default,
    description: 'Our Discovery and Dependency Mapping (DDM) product.',
    link: '/insights/',
    imageClass: 'insightsLogo',
  },
]

function Feature({ Svg, title, description, link, imageClass }) {
  return (
    <Grid item xs={12} sm={6} display='flex' justifyContent='center'>
      <StyledCard component='a' href={link} sx={{ textDecoration: 'none' }}>
        <ImageContainer>
          <FeatureSvg className={`feature-svg ${imageClass}`}>
            <Svg role='img' />
          </FeatureSvg>
        </ImageContainer>
        <CardContent sx={{ padding: 0, '&:last-child': { paddingBottom: 0 } }}>
          <CardTitle variant='h3' component='h3'>
            {title}
          </CardTitle>
          <CardDescription variant='body1'>{description}</CardDescription>
        </CardContent>
      </StyledCard>
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
        <StyledContainer>
          <Grid
            container
            spacing={3}
            justifyContent='center'
            alignItems='stretch'
            sx={{
              maxWidth: '100%',
              margin: 0,
              '& .MuiGrid-item': {
                display: 'flex',
                justifyContent: 'center',
              },
            }}
          >
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </Grid>
        </StyledContainer>
      )}
    </>
  )
}
