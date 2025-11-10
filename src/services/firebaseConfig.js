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

// Initialize Firebase only if it hasn't been initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} else {
  console.log('Using existing Firebase app instance');
}

// Initialize services
export const db = firebase.firestore();
export const firestore = firebase.firestore();
export const auth = firebase.auth();

// Configure auth for web (persistence) - optional for Snack compatibility
if (Platform.OS === 'web') {
  try {
    // Firebase v8 automatically uses browserLocalPersistence on web
    // No need for explicit setPersistence in v8
  } catch (error) {
    console.warn('Auth persistence setup skipped');
  }
}

// ServerTimestamp helper function
export const ServerTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

// Export app for potential future use
export default firebase;
