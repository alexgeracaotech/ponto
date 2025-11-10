// Import Firebase core and services
// The order matters: app first, then services
import firebase from 'firebase/app';
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

// Initialize Firebase
if (!firebase.apps || firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

// Get the default app instance
const app = firebase.app();

// Initialize services - these are now available after the imports
const db = app.firestore();
const firestore = app.firestore();
const auth = app.auth();

// Configure auth for web (persistence)
if (Platform.OS === 'web') {
  try {
    // Firebase v8 automatically uses browserLocalPersistence on web
  } catch (error) {
    console.warn('Auth persistence setup skipped:', error);
  }
}

// ServerTimestamp helper function
export const ServerTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

// Export services
export { db, firestore, auth };

// Export app
export default firebase;
