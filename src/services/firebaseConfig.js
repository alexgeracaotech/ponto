// Import Firebase - default import for Firebase v8
import firebase from 'firebase/app';

// Import Firebase services as side effects
// These must be imported to register the services with firebase
import 'firebase/firestore';
import 'firebase/auth';

import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAuwfo2YoVn5teLUvujL9F8SERL9-kyjwI",
  authDomain: "estagio-13e16.firebaseapp.com",
  projectId: "estagio-13e16",
  storageBucket: "estagio-13e16.firebasestorage.app",
  messagingSenderId: "155883931109",
  appId: "1:155883931109:web:55b763826560f1d3c05b0c",
  measurementId: "G-NM4HKFL8F1"
};

// Initialize Firebase app
let app;
if (!firebase.apps || firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
  console.log('Firebase app initialized');
} else {
  app = firebase.app();
  console.log('Using existing Firebase app');
}

// Initialize services with error handling
let db, firestore, auth;

try {
  // Check if firestore service is available
  if (firebase.firestore) {
    db = firebase.firestore();
    firestore = firebase.firestore();
    console.log('Firestore initialized');
  } else {
    throw new Error('Firestore service not available');
  }

  // Check if auth service is available
  if (firebase.auth) {
    auth = firebase.auth();
    console.log('Auth initialized');
  } else {
    throw new Error('Auth service not available');
  }
} catch (error) {
  console.error('Error initializing Firebase services:', error);
  // Try alternative initialization
  try {
    db = app.firestore();
    firestore = app.firestore();
    auth = app.auth();
    console.log('Firebase services initialized via app instance');
  } catch (retryError) {
    console.error('Retry failed:', retryError);
    throw new Error('Failed to initialize Firebase services. Make sure firebase package is installed correctly.');
  }
}

// Configure auth for web
if (Platform.OS === 'web') {
  try {
    // Firebase v8 automatically uses browserLocalPersistence on web
  } catch (error) {
    console.warn('Auth persistence setup skipped:', error);
  }
}

// ServerTimestamp helper function
export const ServerTimestamp = () => {
  if (firebase.firestore && firebase.firestore.FieldValue) {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
  throw new Error('Firestore FieldValue not available');
};

// Export services
export { db, firestore, auth };

// Export app and firebase
export default firebase;
