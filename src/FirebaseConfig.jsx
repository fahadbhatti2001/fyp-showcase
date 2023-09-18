import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyACUbmyvmYpjN4DOPey2IibmcAr555KPKE",
  authDomain: "final-year-project-fce3f.firebaseapp.com",
  projectId: "final-year-project-fce3f",
  storageBucket: "final-year-project-fce3f.appspot.com",
  messagingSenderId: "429391603456",
  appId: "1:429391603456:web:ce4c421e1215abdca5b5e5",
  measurementId: "G-HJC87P96GK"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
