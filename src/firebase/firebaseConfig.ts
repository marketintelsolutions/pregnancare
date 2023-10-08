// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwmXwwjgVeR05p7CfvN9aCcdgbhC21Z9s",
  authDomain: "pregnancare.firebaseapp.com",
  projectId: "pregnancare",
  storageBucket: "pregnancare.appspot.com",
  messagingSenderId: "986327922001",
  appId: "1:986327922001:web:68074764c77e88581d4f70",
  measurementId: "G-9Q3P9CKENM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
