import { initializeApp } from "firebase/app"
import {getStorage} from 'firebase/storage'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "test-todo-14367.firebaseapp.com",
    projectId: "test-todo-14367",
    storageBucket: "test-todo-14367.appspot.com",
    messagingSenderId: "1018032584211",
    appId: process.env.REACT_APP_API_ID
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)