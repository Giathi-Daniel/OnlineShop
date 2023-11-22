// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider,  TwitterAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAeHT6T0sbAAksxgzU7mwUEdIsUiK2p3lE",
    authDomain: "pizza-in-dcc85.firebaseapp.com",
    projectId: "pizza-in-dcc85",
    storageBucket: "pizza-in-dcc85.appspot.com",
    messagingSenderId: "573013955692",
    appId: "1:573013955692:web:b3b8e29e68cf2582b0f449"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

auth.languageCode = 'en';

export{
    app,
    auth,
    TwitterAuthProvider,
    FacebookAuthProvider,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult
}