import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "simple-chat-yabessy.firebaseapp.com",
  projectId: "simple-chat-yabessy",
  storageBucket: "simple-chat-yabessy.appspot.com",
  messagingSenderId: "303374114260",
  appId: "1:303374114260:web:ced247985ac4cab0f44a41",
  measurementId: "G-9JQZLELEWV"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }