import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, serverTimestamp, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
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
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} else {
  app = getApps()[0];
  console.log('Using existing Firebase app instance');
}

// Initialize services
export const db = getFirestore(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

// Configure auth for web (persistence)
if (Platform.OS === 'web') {
  // Enable persistence for web
  import('firebase/auth').then(({ setPersistence, browserLocalPersistence }) => {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.warn('Could not set auth persistence:', error);
    });
  }).catch((error) => {
    console.warn('Could not import auth persistence:', error);
  });
}

// ServerTimestamp helper function
export const ServerTimestamp = () => serverTimestamp();

// Export app for potential future use
export default app;
