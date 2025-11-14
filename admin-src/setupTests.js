require('@testing-library/jest-dom')

// Mock Firebase modules
jest.mock('./firebase/config', () => ({
  auth: {},
  db: {},
  analytics: {},
}))

// Mock auth functions - fix the onAuthChange mock
jest.mock('./firebase/auth', () => ({
  getCurrentUser: jest.fn(() => ({ email: 'test@example.com' })),
  logout: jest.fn(),
  onAuthChange: jest.fn(() => jest.fn()), // Return a function for cleanup
}))

jest.mock('./firebase/firestore', () => ({
  getAllVideos: jest.fn(),
  getVideo: jest.fn(),
  createVideo: jest.fn(),
  updateVideo: jest.fn(),
  deleteVideo: jest.fn(),
}))

afterEach(() => {
  jest.clearAllMocks()
})
