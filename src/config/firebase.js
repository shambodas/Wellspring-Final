import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

// Firebase configuration
const firebaseConfig = {
  // Replace with your actual Firebase config
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}

// Initialize Firebase with error handling
let app, auth, db, functions, googleProvider

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  functions = getFunctions(app)
  googleProvider = new GoogleAuthProvider()
} catch (error) {
  console.warn('Firebase initialization failed:', error)
  // Set to null for development mode
  app = null
  auth = null
  db = null
  functions = null
  googleProvider = null
}

// Export services
export { auth, db, functions, googleProvider }
export default app
