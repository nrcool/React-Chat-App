// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-librarie

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:process.env.REACT_APP_API_KEY ,
  authDomain:process.env.REACT_APP_AUTHDOMAIN ,
  projectId:process.env.REACT_APP_PROJECTID ,
  storageBucket:process.env.REACT_APP_STORAGEBUCKET ,
  messagingSenderId:process.env.REACT_APP_MESSSAGINGSENDERID,
  appId:process.env.REACT_APP_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;