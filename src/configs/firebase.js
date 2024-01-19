import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: 'AIzaSyBsiR-nmrZf-ynQnnrSGkoZBe9PQdhEtbs',
  authDomain: 'reviveassets.firebaseapp.com',
  projectId: 'reviveassets',
  storageBucket: 'reviveassets.appspot.com',
  messagingSenderId: '370744973843',
  appId: '1:370744973843:web:716393088d8049e8883de6',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()
export const db = getFirestore(app)

export default app
