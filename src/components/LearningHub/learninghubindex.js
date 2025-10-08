import React from 'react'
import Link from '@docusaurus/Link'
import { Grid, Box } from '@mui/material'
import { learningHubData } from './data/learninghubdata.js'
import {
  learningHubSectionStyle,
  containerStyle,
  headerStyle,
  sectionTitleStyle,
  subtitleStyle,
  categoryTitleStyle,
  courseCardStyle,
  courseContentStyle,
  courseInfoStyle,
  courseTitleStyle,
  courseDescriptionStyle,
  buttonContainerStyle,
  viewCatalogButtonStyle,
  comingSoonButtonStyle,
  categoryBarStyle,
} from '../library/styles/learninghubstyles.js'

const LearningHub = () => {
  const getButtonStyle = available => {
    return available ? viewCatalogButtonStyle : comingSoonButtonStyle
  }

  const getCategoryBarColor = category => {
    const colors = {
      'Automation Design': '#4A90E2',
      'Automation Development': '#1E3A8A',
      'Device Discovery and Management': '#008B8B',
    }
    return colors[category] || '#008B8B'
  }

  const getCategoryAnchor = categoryName => {
    return categoryName.toLowerCase().replace(/\s+/g, '').replace(/&/g, 'and')
  }

  return (
    <section style={learningHubSectionStyle} className='learning-hub-section'>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={sectionTitleStyle}>{learningHubData.title}</h1>
          <p style={subtitleStyle}>{learningHubData.subtitle}</p>
          <p style={subtitleStyle}>{learningHubData.description}</p>
          <div
            style={{
              width: '100px',
              height: '3px',
              background: '#008B8B',
              margin: '40px auto 0 auto',
            }}
          ></div>
        </div>

        {/* Course Categories */}
        {learningHubData.categories.map((category, categoryIndex) => (
          <div key={categoryIndex} style={{ marginBottom: '60px' }}>
            <h2
              id={getCategoryAnchor(category.name)}
              style={categoryTitleStyle}
            >
              {category.name}
            </h2>

            <Grid container spacing={3}>
              {category.courses.map((course, courseIndex) => (
                <Grid
                  key={courseIndex}
                  size={{
                    xs: 12, // 1 column on all screen sizes
                  }}
                >
                  <Box
                    style={{
                      ...courseCardStyle,
                      borderLeft: `6px solid ${getCategoryBarColor(
                        category.name,
                      )}`,
                    }}
                  >
                    <div style={courseContentStyle}>
                      <div style={courseInfoStyle}>
                        <h3 style={courseTitleStyle}>{course.title}</h3>
                        <p style={courseDescriptionStyle}>
                          {course.description}
                        </p>
                      </div>

                      <div style={buttonContainerStyle}>
                        {course.available ? (
                          <Link
                            to={course.link}
                            style={getButtonStyle(course.available)}
                          >
                            View Catalog
                          </Link>
                        ) : (
                          <span style={getButtonStyle(course.available)}>
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category bar at bottom */}
                    <div
                      style={{
                        ...categoryBarStyle,
                        backgroundColor: getCategoryBarColor(category.name),
                      }}
                    >
                      {category.name}
                    </div>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Accent line below each category section */}
            <div
              style={{
                width: '100%',
                height: '2px',
                background: `linear-gradient(90deg, ${getCategoryBarColor(
                  category.name,
                )} 0%, transparent 100%)`,
                margin: '40px 0 0 0',
              }}
            ></div>
          </div>
        ))}

        {/* Help Section */}
        <div
          style={{
            background: '#F7FAFC',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            border: '1px solid #008B8B',
            marginTop: '60px',
          }}
        >
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: '600',
              color: '#2D3748',
              marginBottom: '16px',
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            }}
          >
            {learningHubData.helpSection.title}
          </h2>
          <p
            style={{
              color: '#4A5568',
              lineHeight: '1.6',
              marginBottom: '0',
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            }}
          >
            {learningHubData.helpSection.description}{' '}
            <Link
              to={`mailto:${learningHubData.helpSection.email}`}
              style={{
                color: '#008B8B',
                textDecoration: 'underline',
              }}
            >
              {learningHubData.helpSection.email}
            </Link>{' '}
            {learningHubData.helpSection.additionalText}
          </p>
        </div>
      </div>
    </section>
  )
}

export default LearningHub
