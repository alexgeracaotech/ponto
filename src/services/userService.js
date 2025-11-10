import { auth, firestore } from './firebaseConfig';
import firebase from './firebaseConfig';

/**
 * Service for user-related database operations
 */

/**
 * Creates a new user in Firestore
 * @param {string} uid - User ID from Firebase Auth
 * @param {Object} userData - User data to save
 * @returns {Promise<void>}
 */
export const createUserDocument = async (uid, userData) => {
  try {
    console.log('=== Creating User Document ===');
    console.log('UID:', uid);
    console.log('User Data to save:', userData);
    
    const userRef = firestore.collection('users').doc(uid);
    console.log('Document reference created:', userRef.path);
    
    // Prepare complete user data
    const completeUserData = {
      ...userData,
      uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      role: userData.role || 'estagiario',
    };

    console.log('Complete user data prepared:', completeUserData);
    console.log('Attempting to save to Firestore...');

    // Save to Firestore
    await userRef.set(completeUserData);
    console.log('setDoc completed successfully');
    
    // Verify document was created
    console.log('Verifying document was created...');
    const docSnapshot = await userRef.get();
    
    if (!docSnapshot.exists) {
      console.error('Document does not exist after save!');
      throw new Error('Falha ao criar documento do usuário no banco de dados.');
    }

    const savedData = docSnapshot.data();
    console.log('=== Document Created Successfully ===');
    console.log('Document ID:', docSnapshot.id);
    console.log('Saved data:', savedData);
    console.log('Document exists:', docSnapshot.exists);
    
    return savedData;
  } catch (error) {
    console.error('=== Error Creating User Document ===');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};

/**
 * Gets user data from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>}
 */
export const getUserDocument = async (uid) => {
  try {
    console.log('=== Getting User Document ===');
    console.log('UID:', uid);
    
    const userRef = firestore.collection('users').doc(uid);
    console.log('Document path:', userRef.path);
    
    const docSnapshot = await userRef.get();
    console.log('Document snapshot retrieved');
    console.log('Document exists:', docSnapshot.exists);
    
    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      console.log('=== User Document Found ===');
      console.log('Document data:', data);
      return data;
    }
    
    console.log('=== User Document Not Found ===');
    return null;
  } catch (error) {
    console.error('=== Error Getting User Document ===');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};

/**
 * Updates user data in Firestore
 * @param {string} uid - User ID
 * @param {Object} updates - Data to update
 * @returns {Promise<void>}
 */
export const updateUserDocument = async (uid, updates) => {
  try {
    const userRef = firestore.collection('users').doc(uid);
    
    await userRef.update({
      ...updates,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log('User document updated successfully:', uid);
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
};

/**
 * Checks if email already exists in Firestore
 * @param {string} email - Email to check
 * @returns {Promise<boolean>}
 */
export const checkEmailExists = async (email) => {
  try {
    const usersRef = firestore.collection('users');
    const q = usersRef.where('email', '==', email.toLowerCase()).limit(1);
    const snapshot = await q.get();
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking email:', error);
    throw error;
  }
};

/**
 * Gets the current authenticated user's data from Firestore
 * @returns {Promise<Object|null>}
 */
export const getCurrentUserData = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }
    return await getUserDocument(currentUser.uid);
  } catch (error) {
    console.error('Error getting current user data:', error);
    throw error;
  }
};

/**
 * Verifies if a user document exists in Firestore
 * @param {string} uid - User ID
 * @returns {Promise<boolean>}
 */
export const verifyUserDocumentExists = async (uid) => {
  try {
    console.log('=== Verifying User Document ===');
    console.log('Checking UID:', uid);
    
    const userRef = firestore.collection('users').doc(uid);
    const docSnapshot = await userRef.get();
    
    const exists = docSnapshot.exists;
    console.log('Document exists:', exists);
    
    if (exists) {
      console.log('Document data:', docSnapshot.data());
    } else {
      console.log('Document does not exist in Firestore');
    }
    
    return exists;
  } catch (error) {
    console.error('Error verifying user document:', error);
    throw error;
  }
};
