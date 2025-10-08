import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Custom render function with router wrapper
export const renderWithRouter = (ui, options = {}) => {
  const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>

  return render(ui, { wrapper: Wrapper, ...options })
}

// Mock video data factory
export const createMockVideo = (overrides = {}) => ({
  firestoreId: 'firebase-doc-id-1',
  customId: 'test-video',
  id: 'test-video',
  title: 'Test Video',
  description: 'Test description',
  videoUrl: 'https://youtube.com/watch?v=test',
  videoId: 'test123',
  platform: 'youtube',
  duration: '5:00',
  level: 'step-by-step',
  category: 'Test Category',
  section: 'Test Section',
  product: 'actions',
  featured: false,
  tags: ['test'],
  template: 'instructional',
  learningObjectives: 'Test objectives',
  estimatedTime: '5 minutes',
  transcript: 'Test transcript',
  tutorialSteps: [{ step: 1, title: 'Step 1', content: 'Content 1' }],
  learningResources: [
    { title: 'Resource 1', description: 'Desc 1', link: 'http://example.com' },
  ],
  documentResources: [
    {
      title: 'Doc 1',
      description: 'Doc desc',
      link: 'http://docs.example.com',
    },
  ],
  learningPath: {
    isPartOfPath: false,
    pathName: '',
    pathId: '',
    orderInPath: '',
    previousVideoId: '',
    nextVideoId: '',
  },
  suggestedNextVideo: '',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

// Mock Firebase auth responses
export const mockAuthUser = {
  email: 'test@example.com',
  uid: 'test-uid',
}

// Mock Firebase success/error responses
export const createFirebaseResponse = (
  success = true,
  data = null,
  error = null,
) => ({
  success,
  data,
  error,
})
