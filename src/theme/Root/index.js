// src/theme/Root/index.js
import React from 'react'
import { AuthProvider } from '@site/src/contexts/AuthContext'
import { FirebaseProvider } from '@site/src/contexts/FirebaseContext'

// This is the universal wrapper that applies to ALL pages
export default function Root({ children }) {
  return (
    <FirebaseProvider>
      <AuthProvider>{children}</AuthProvider>
    </FirebaseProvider>
  )
}
