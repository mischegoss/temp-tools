// src/components/Forms/login/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import { useAuth } from '@site/src/contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();
  const history = useHistory();
  const [isProtectedPath, setIsProtectedPath] = useState(false);
  
  useEffect(() => {
    // Determine if current path is protected
    const currentPath = window.location.pathname;
    
    // Only protect paths that start with /learning/ (excluding the login page)
    const protectedPath = currentPath.startsWith('/learning/') && 
                          currentPath !== '/learning/login';
    
    setIsProtectedPath(protectedPath);
    
    console.log('[ProtectedRoute] Path check:', {
      path: currentPath,
      isProtected: protectedPath,
      loading,
      isAuthenticated: !!user
    });
    
    // ONLY redirect on learning paths - don't protect homepage or other sections
    if (!loading && protectedPath && !user) {
      console.log('[ProtectedRoute] User not authenticated on protected learning path');
      console.log('[ProtectedRoute] Saving redirect path:', currentPath);
      sessionStorage.setItem('redirectUrl', currentPath);
      
      console.log('[ProtectedRoute] Redirecting to login page');
      window.location.href = '/learning/login';
    } else if (!loading) {
      if (protectedPath && user) {
        console.log('[ProtectedRoute] User authenticated on protected path, allowing access');
      } else if (!protectedPath) {
        console.log('[ProtectedRoute] Not a protected path, no auth check needed');
      }
    } else {
      console.log('[ProtectedRoute] Still loading auth state, waiting...');
    }
  }, [loading, user, history]);

  // Show loading spinner only on protected learning paths while authentication is loading
  if (loading && isProtectedPath) {
    console.log('[ProtectedRoute] Showing loading spinner on protected path');
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '2rem',
        margin: '2rem'
      }}>
        <div className="loading-spinner" style={{
          display: 'inline-block',
          width: '50px',
          height: '50px',
          border: '3px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          borderTopColor: '#3b82f6',
          animation: 'spin 1s ease-in-out infinite'
        }}></div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  // Always render children on non-protected paths
  // Only check auth on learning paths
  const shouldRenderChildren = !isProtectedPath || (isProtectedPath && user);
  
  console.log('[ProtectedRoute] Render decision:', {
    isProtectedPath,
    userAuthenticated: !!user,
    shouldRenderChildren
  });
  
  return shouldRenderChildren ? children : null;
}
