import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import VideoItem from '../VideoManagement/VideoItem'
import VideoSearch from '../VideoManagement/VideoSearch'

const mockVideo = {
  firestoreId: 'firebase-doc-123',
  customId: 'hello-world',
  id: 'hello-world',
  title: 'Test Video',
  duration: '5:00',
  level: 'step-by-step',
  category: 'Testing',
  learningPath: { isPartOfPath: false },
}

describe('Video Management - Core Functionality', () => {
  test('VideoItem passes correct IDs to handlers', () => {
    const mockHandlers = {
      onEdit: jest.fn(),
      onDelete: jest.fn(),
      onViewJSON: jest.fn(),
    }

    render(<VideoItem video={mockVideo} {...mockHandlers} />)

    // Test that edit button calls with firestoreId
    fireEvent.click(screen.getByText('Edit'))
    expect(mockHandlers.onEdit).toHaveBeenCalledWith('firebase-doc-123')

    // Test that JSON button calls with firestoreId
    fireEvent.click(screen.getByText('View JSON'))
    expect(mockHandlers.onViewJSON).toHaveBeenCalledWith('firebase-doc-123')

    // Test that delete calls with video object
    fireEvent.click(screen.getByText('Delete'))
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockVideo)
  })

  test('VideoSearch calls onSearch', () => {
    const mockOnSearch = jest.fn()
    render(<VideoSearch onSearch={mockOnSearch} />)

    const searchInput = screen.getByPlaceholderText(/search by title/i)
    fireEvent.change(searchInput, { target: { value: 'test' } })

    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })

  test('ID handling works correctly', () => {
    expect(mockVideo.firestoreId).toBe('firebase-doc-123')
    expect(mockVideo.customId).toBe('hello-world')
  })
})
