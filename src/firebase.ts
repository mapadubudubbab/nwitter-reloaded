// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqR8dnXYU5t-W5yBbi1ttNGtViQYiZ0wg",
    authDomain: "nwitter-reloaded-4a3d6.firebaseapp.com",
    projectId: "nwitter-reloaded-4a3d6",
    storageBucket: "nwitter-reloaded-4a3d6.appspot.com",
    messagingSenderId: "1063214365081",
    appId: "1:1063214365081:web:1d60ff2a63d5c42916bb08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
