import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6SvArCHYZ8eEVoDxsBEf02B094yVESPM",
  authDomain: "notes-portal-13e13.firebaseapp.com",
  projectId: "notes-portal-13e13",
  storageBucket: "notes-portal-13e13.firebasestorage.app",
  messagingSenderId: "970740403701",
  appId: "1:970740403701:web:cad9f177316599d17ca4bc"
};

// Initialize Firebase (Only Auth and Firestore)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
