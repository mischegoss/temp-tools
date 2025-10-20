// src/firebase/firebaseService.js

import { db } from './firebase'; // Assuming this is your existing Firebase setup
import { collection, addDoc, updateDoc, doc, getDoc, setDoc, increment } from 'firebase/firestore';

// Track when a user views a card
const trackCardView = async (userId, courseType, cardTitle) => {
  try {
    // Create a unique ID for this card view
    const cardId = cardTitle.replace(/\s+/g, '-').toLowerCase();
    
    // Reference to the user's activity document with course type
    const userActivityRef = doc(db, 'user-activities', `${userId}_${courseType}`);
    
    // Check if document exists
    const userActivityDoc = await getDoc(userActivityRef);
    
    if (userActivityDoc.exists()) {
      // Update existing document with new card view
      const viewedCards = userActivityDoc.data().viewedCards || {};
      
      // Only add if not already viewed
      if (!viewedCards[cardId]) {
        viewedCards[cardId] = true;
        
        await updateDoc(userActivityRef, {
          viewedCards,
          totalCardsViewed: increment(1),
          lastUpdated: new Date()
        });
      }
    } else {
      // Create new user activity document
      await setDoc(userActivityRef, {
        userId,
        courseType,
        viewedCards: { [cardId]: true },
        totalCardsViewed: 1,
        lastUpdated: new Date()
      });
    }
    
    // Also track in the overall analytics collection
    await addDoc(collection(db, 'card-views'), {
      userId,
      courseType,
      cardId,
      cardTitle,
      viewedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking card view:', error);
    return false;
  }
};

// Check if all cards have been viewed
const checkAllCardsViewed = async (userId, courseType, totalCardCount) => {
  try {
    // Use course-specific document ID
    const userActivityRef = doc(db, 'user-activities', `${userId}_${courseType}`);
    const userActivityDoc = await getDoc(userActivityRef);
    
    if (!userActivityDoc.exists()) {
      return false;
    }
    
    const { totalCardsViewed } = userActivityDoc.data();
    return totalCardsViewed >= totalCardCount;
  } catch (error) {
    console.error('Error checking card completion:', error);
    return false;
  }
};

export { trackCardView, checkAllCardsViewed };
