import React, { useState } from 'react'
import { Grid, Box } from '@mui/material'
import Button from '../Button/button.js'
import { styles } from './styles/videotemplatestyles.js'
import videoTemplateData from './data/videotemplatedata.js'

const VideoTemplate = ({
  tag,
  heading,
  description,
  expandable1,
  expandable2,
  button,
  videoUrl,
}) => {
  const [expandedSection, setExpandedSection] = useState(null)

  // Fallback to default data if no props provided
  const defaultData = videoTemplateData?.default || {}

  const data = {
    tag: tag || defaultData.tag || 'SAMPLE TAG',
    heading: heading || defaultData.heading || 'Sample Heading',
    description:
      description || defaultData.description || 'Sample description text.',
    expandable1: expandable1 ||
      defaultData.expandable1 || {
        title: 'Feature 1',
        content: 'Sample content 1',
      },
    expandable2:
      expandable2 !== undefined ? expandable2 : defaultData.expandable2,
    button: button ||
      defaultData.button || {
        text: 'Learn More',
        link: '#',
        variant: 'primary',
      },
    videoUrl: videoUrl || defaultData.videoUrl || null,
  }

  const toggleSection = sectionId => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const renderVideo = () => {
    if (!data.videoUrl) {
      return (
        <div style={styles.placeholderVideo}>
          <div style={styles.placeholderContent}>
            <span style={styles.placeholderIcon}>▶️</span>
            <div style={styles.placeholderText}>No Video URL Provided</div>
            <div style={styles.placeholderSubtext}>
              Add a videoUrl to display content
            </div>
          </div>
        </div>
      )
    }

    return (
      <iframe
        style={styles.videoIframe}
        src={data.videoUrl}
        title='Video Player'
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      />
    )
  }

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <Grid container spacing={6} alignItems='center'>
          {/* Left Column - Content */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <div style={styles.tag}>{data.tag}</div>
            <h1 style={styles.heading}>{data.heading}</h1>
            <p style={styles.description}>{data.description}</p>

            {/* Expandable Sections */}
            <Box sx={{ marginBottom: '40px' }}>
              {/* Expandable 1 */}
              {data.expandable1 && (
                <Box style={styles.expandableSection}>
                  <Box
                    style={styles.sectionHeader}
                    onClick={() => toggleSection('expandable1')}
                  >
                    <h3 style={styles.sectionTitle}>
                      {data.expandable1.title}
                    </h3>
                    <span
                      style={{
                        ...styles.chevron,
                        transform:
                          expandedSection === 'expandable1'
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                      }}
                    >
                      ▼
                    </span>
                  </Box>
                  {expandedSection === 'expandable1' && (
                    <Box style={styles.sectionContent}>
                      {data.expandable1.content}
                    </Box>
                  )}
                </Box>
              )}

              {/* Expandable 2 - Only show if data exists */}
              {data.expandable2 &&
                data.expandable2.title &&
                data.expandable2.content && (
                  <Box style={styles.expandableSection}>
                    <Box
                      style={styles.sectionHeader}
                      onClick={() => toggleSection('expandable2')}
                    >
                      <h3 style={styles.sectionTitle}>
                        {data.expandable2.title}
                      </h3>
                      <span
                        style={{
                          ...styles.chevron,
                          transform:
                            expandedSection === 'expandable2'
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)',
                        }}
                      >
                        ▼
                      </span>
                    </Box>
                    {expandedSection === 'expandable2' && (
                      <Box style={styles.sectionContent}>
                        {data.expandable2.content}
                      </Box>
                    )}
                  </Box>
                )}
            </Box>

            <Button
              variant={data.button.variant}
              size='medium'
              to={data.button.link}
            >
              {data.button.text}
            </Button>
          </Grid>

          {/* Right Column - Video */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <div style={styles.videoContainer}>{renderVideo()}</div>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default VideoTemplate
