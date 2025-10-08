// src/components/__tests__/VideoManagement.test.js
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Mock Firebase before importing components
jest.mock('../../firebase/firestore', () => ({
  getAllVideos: jest.fn(),
  getVideo: jest.fn(),
  createVideo: jest.fn(),
  updateVideo: jest.fn(),
  deleteVideo: jest.fn(),
}))

jest.mock('../../firebase/auth', () => ({
  getCurrentUser: jest.fn(() => ({ email: 'test@example.com' })),
  logout: jest.fn(),
  onAuthChange: jest.fn(),
}))

// Import components after mocking
import VideoItem from '../VideoManagement/VideoItem'
import VideoSearch from '../VideoManagement/VideoSearch'
import DeleteConfirmation from '../VideoManagement/DeleteConfirmation'

// Test data
const mockVideo = {
  firestoreId: 'firebase-doc-id-1',
  customId: 'hello-world',
  id: 'hello-world',
  title: 'Hello World Tutorial',
  description: 'Learn the basics',
  videoUrl: 'https://youtube.com/watch?v=123',
  videoId: '123',
  platform: 'youtube',
  duration: '5:30',
  level: 'step-by-step',
  category: 'Getting Started',
  section: 'Basics',
  product: 'actions',
  featured: false,
  tags: ['basics', 'tutorial'],
  learningPath: {
    isPartOfPath: false,
    pathName: '',
    pathId: '',
    orderInPath: '',
    previousVideoId: '',
    nextVideoId: '',
  },
  suggestedNextVideo: 'advanced-tutorial',
}

// Helper component for routing
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Video Management Components', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('VideoItem Component', () => {
    const mockHandlers = {
      onEdit: jest.fn(),
      onDelete: jest.fn(),
      onViewJSON: jest.fn(),
    }

    test('renders video item correctly', () => {
      render(<VideoItem video={mockVideo} {...mockHandlers} />)

      expect(screen.getByText('Hello World Tutorial')).toBeInTheDocument()
      expect(screen.getByText('hello-world')).toBeInTheDocument()
      expect(screen.getByText('⏱️ 5:30')).toBeInTheDocument()
      expect(screen.getByText('📊 step-by-step')).toBeInTheDocument()
      expect(screen.getByText('🎯 Getting Started')).toBeInTheDocument()
    })

    test('calls edit handler with correct firestoreId', () => {
      render(<VideoItem video={mockVideo} {...mockHandlers} />)

      const editButton = screen.getByText('Edit')
      fireEvent.click(editButton)

      expect(mockHandlers.onEdit).toHaveBeenCalledWith('firebase-doc-id-1')
    })

    test('calls JSON handler with correct firestoreId', () => {
      render(<VideoItem video={mockVideo} {...mockHandlers} />)

      const jsonButton = screen.getByText('View JSON')
      fireEvent.click(jsonButton)

      expect(mockHandlers.onViewJSON).toHaveBeenCalledWith('firebase-doc-id-1')
    })

    test('calls delete handler with video object', () => {
      render(<VideoItem video={mockVideo} {...mockHandlers} />)

      const deleteButton = screen.getByText('Delete')
      fireEvent.click(deleteButton)

      expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockVideo)
    })

    test('displays learning path status correctly', () => {
      const videoInPath = {
        ...mockVideo,
        learningPath: {
          isPartOfPath: true,
          pathName: 'Master Class',
          orderInPath: '2',
        },
      }

      render(<VideoItem video={videoInPath} {...mockHandlers} />)

      expect(
        screen.getByText('🔗 Master Class (Position 2)'),
      ).toBeInTheDocument()
    })
  })

  describe('VideoSearch Component', () => {
    test('renders search input correctly', () => {
      const mockOnSearch = jest.fn()

      render(<VideoSearch onSearch={mockOnSearch} />)

      expect(
        screen.getByPlaceholderText(/search by title/i),
      ).toBeInTheDocument()
      expect(screen.getByText('🔍')).toBeInTheDocument()
    })

    test('calls onSearch when input changes', () => {
      const mockOnSearch = jest.fn()

      render(<VideoSearch onSearch={mockOnSearch} />)

      const searchInput = screen.getByPlaceholderText(/search by title/i)
      fireEvent.change(searchInput, { target: { value: 'hello' } })

      expect(mockOnSearch).toHaveBeenCalledWith('hello')
    })

    test('shows clear button when there is text', () => {
      const mockOnSearch = jest.fn()

      render(<VideoSearch onSearch={mockOnSearch} />)

      const searchInput = screen.getByPlaceholderText(/search by title/i)
      fireEvent.change(searchInput, { target: { value: 'test' } })

      expect(screen.getByText('✕')).toBeInTheDocument()
    })

    test('clears search when clear button is clicked', () => {
      const mockOnSearch = jest.fn()

      render(<VideoSearch onSearch={mockOnSearch} />)

      const searchInput = screen.getByPlaceholderText(/search by title/i)
      fireEvent.change(searchInput, { target: { value: 'test' } })

      const clearButton = screen.getByText('✕')
      fireEvent.click(clearButton)

      expect(mockOnSearch).toHaveBeenCalledWith('')
      expect(searchInput.value).toBe('')
    })
  })

  describe('DeleteConfirmation Component', () => {
    const mockHandlers = {
      onConfirm: jest.fn(),
      onCancel: jest.fn(),
    }

    test('renders delete confirmation with video info', () => {
      render(
        <DeleteConfirmation
          video={mockVideo}
          isDeleting={false}
          {...mockHandlers}
        />,
      )

      expect(screen.getByText('⚠️ Delete Video?')).toBeInTheDocument()
      expect(screen.getByText('Hello World Tutorial')).toBeInTheDocument()
      expect(screen.getByText('Custom ID: hello-world')).toBeInTheDocument()
      expect(
        screen.getByText('Firestore ID: firebase-doc-id-1'),
      ).toBeInTheDocument()
    })

    test('shows learning path warning for videos in paths', () => {
      const videoInPath = {
        ...mockVideo,
        learningPath: {
          isPartOfPath: true,
          pathName: 'Master Class',
        },
      }

      render(
        <DeleteConfirmation
          video={videoInPath}
          isDeleting={false}
          {...mockHandlers}
        />,
      )

      expect(
        screen.getByText(/This video is part of a learning path/),
      ).toBeInTheDocument()
      expect(screen.getByText('Master Class')).toBeInTheDocument()
    })

    test('calls handlers when buttons are clicked', () => {
      render(
        <DeleteConfirmation
          video={mockVideo}
          isDeleting={false}
          {...mockHandlers}
        />,
      )

      fireEvent.click(screen.getByText('Delete Video'))
      expect(mockHandlers.onConfirm).toHaveBeenCalled()

      fireEvent.click(screen.getByText('Cancel'))
      expect(mockHandlers.onCancel).toHaveBeenCalled()
    })

    test('disables buttons when deleting', () => {
      render(
        <DeleteConfirmation
          video={mockVideo}
          isDeleting={true}
          {...mockHandlers}
        />,
      )

      expect(screen.getByText('Deleting...')).toBeInTheDocument()
      expect(screen.getByText('Deleting...')).toBeDisabled()
      expect(screen.getByText('Cancel')).toBeDisabled()
    })

    test('does not render when video is null', () => {
      const { container } = render(
        <DeleteConfirmation
          video={null}
          isDeleting={false}
          {...mockHandlers}
        />,
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('ID Handling Tests', () => {
    test('correctly separates firestoreId and customId', () => {
      const video = {
        firestoreId: 'firebase-abc123',
        customId: 'my-custom-id',
        id: 'my-custom-id',
        title: 'Test Video',
      }

      const mockOnEdit = jest.fn()

      render(
        <VideoItem
          video={video}
          onEdit={mockOnEdit}
          onDelete={jest.fn()}
          onViewJSON={jest.fn()}
        />,
      )

      // Should display custom ID
      expect(screen.getByText('my-custom-id')).toBeInTheDocument()

      // Should call with firestore ID
      fireEvent.click(screen.getByText('Edit'))
      expect(mockOnEdit).toHaveBeenCalledWith('firebase-abc123')
    })

    test('handles backward compatibility when customId is missing', () => {
      const videoOldFormat = {
        firestoreId: 'firebase-abc123',
        id: 'fallback-id',
        title: 'Test Video',
      }

      const mockOnEdit = jest.fn()

      render(
        <VideoItem
          video={videoOldFormat}
          onEdit={mockOnEdit}
          onDelete={jest.fn()}
          onViewJSON={jest.fn()}
        />,
      )

      // Should display fallback ID
      expect(screen.getByText('fallback-id')).toBeInTheDocument()

      // Should still call with firestore ID
      fireEvent.click(screen.getByText('Edit'))
      expect(mockOnEdit).toHaveBeenCalledWith('firebase-abc123')
    })
  })
})

// src/components/__tests__/firestore.test.js
describe('Firestore Functions', () => {
  test('basic import test', () => {
    const firestoreFunctions = require('../../firebase/firestore')

    expect(typeof firestoreFunctions.getAllVideos).toBe('function')
    expect(typeof firestoreFunctions.getVideo).toBe('function')
    expect(typeof firestoreFunctions.createVideo).toBe('function')
    expect(typeof firestoreFunctions.updateVideo).toBe('function')
    expect(typeof firestoreFunctions.deleteVideo).toBe('function')
  })
})

// Basic sanity test
describe('Basic Tests', () => {
  test('should pass basic test', () => {
    expect(true).toBe(true)
  })

  test('should handle mock video data structure', () => {
    expect(mockVideo.firestoreId).toBe('firebase-doc-id-1')
    expect(mockVideo.customId).toBe('hello-world')
    expect(mockVideo.title).toBe('Hello World Tutorial')
  })
})
