/**
 * Utility functions to test Firebase connectivity and data storage
 */

import { auth, firestore } from '../services/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

/**
 * Test Firebase connection
 */
export const testFirebaseConnection = async () => {
  try {
    console.log('=== Testing Firebase Connection ===');
    
    // Test Firestore connection
    console.log('Testing Firestore connection...');
    const testRef = collection(firestore, 'users');
    const snapshot = await getDocs(testRef);
    console.log('Firestore connection: OK');
    console.log('Total users in database:', snapshot.size);
    
    // Test Auth
    console.log('Testing Auth connection...');
    const currentUser = auth.currentUser;
    console.log('Auth connection: OK');
    console.log('Current user:', currentUser ? currentUser.uid : 'Not logged in');
    
    return {
      firestore: true,
      auth: true,
      userCount: snapshot.size,
      currentUser: currentUser ? currentUser.uid : null
    };
  } catch (error) {
    console.error('=== Firebase Connection Test Failed ===');
    console.error('Error:', error);
    return {
      firestore: false,
      auth: false,
      error: error.message
    };
  }
};

/**
 * List all users in Firestore (for debugging)
 */
export const listAllUsers = async () => {
  try {
    console.log('=== Listing All Users ===');
    const usersRef = collection(firestore, 'users');
    const snapshot = await getDocs(usersRef);
    
    const users = [];
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('Total users:', users.length);
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        uid: user.uid,
        email: user.email,
        username: user.username
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error listing users:', error);
    throw error;
  }
};

