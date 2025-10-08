// src/contexts/UserActivityContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { trackCardView, checkAllCardsViewed } from '../firebase/firebaseService';

const UserActivityContext = createContext();

export const useUserActivity = () => useContext(UserActivityContext);

export const UserActivityProvider = ({ children, totalCards, courseType }) => {
  const { user } = useAuth();
  const [viewedCards, setViewedCards] = useState({});
  const [allCardsViewed, setAllCardsViewed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to mark a card as viewed
  const markCardAsViewed = async (cardTitle) => {
    if (!user) return;

    const cardId = cardTitle.replace(/\s+/g, '-').toLowerCase();
    
    // Update local state
    if (!viewedCards[cardId]) {
      const updatedViewedCards = {
        ...viewedCards,
        [cardId]: true
      };
      
      setViewedCards(updatedViewedCards);
      
      // Update Firebase with course type
      await trackCardView(user.uid, courseType, cardTitle);
      
      // Check if all cards are now viewed
      const viewedCount = Object.keys(updatedViewedCards).length;
      if (viewedCount >= totalCards) {
        setAllCardsViewed(true);
      }
    }
  };

  // Load user's viewed cards when component mounts or user changes
  useEffect(() => {
    const loadUserActivity = async () => {
      if (!user) {
        setViewedCards({});
        setAllCardsViewed(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch user activity from Firestore
        const { db } = await import('../firebase/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        
        // Use course-specific document ID
        const userActivityRef = doc(db, 'user-activities', `${user.uid}_${courseType}`);
        const userActivityDoc = await getDoc(userActivityRef);
        
        if (userActivityDoc.exists()) {
          const userData = userActivityDoc.data();
          setViewedCards(userData.viewedCards || {});
          
          // Check if all cards have been viewed
          const viewedCount = Object.keys(userData.viewedCards || {}).length;
          setAllCardsViewed(viewedCount >= totalCards);
        } else {
          setViewedCards({});
          setAllCardsViewed(false);
        }
      } catch (error) {
        console.error('Error loading user activity:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserActivity();
  }, [user, totalCards, courseType]);

  return (
    <UserActivityContext.Provider
      value={{
        viewedCards,
        markCardAsViewed,
        allCardsViewed,
        isLoading
      }}
    >
      {children}
    </UserActivityContext.Provider>
  );
};