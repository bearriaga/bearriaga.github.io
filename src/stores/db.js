// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCHQkMeiW85qRbkfjVb1FD9p6JFA_rQ80g",
    authDomain: "bryan-arriaga-website.firebaseapp.com",
    projectId: "bryan-arriaga-website",
    storageBucket: "bryan-arriaga-website.appspot.com",
    messagingSenderId: "342177213475",
    appId: "1:342177213475:web:9edadc092dc4099ebe1596",
    measurementId: "G-ZYKN9E6YWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    db
}