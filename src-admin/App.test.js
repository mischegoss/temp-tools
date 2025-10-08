import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

test('renders without crashing', () => {
  render(<AppWithRouter />)
  // Just verify it doesn't crash
})
