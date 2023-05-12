import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCTYO4bnOTM-t4MkJLuTyUcBljBUnBI1eU",
    authDomain: "click-m.firebaseapp.com",
    databaseURL: "https://click-m-default-rtdb.firebaseio.com",
    projectId: "click-m",
    storageBucket: "click-m.appspot.com",
    messagingSenderId: "162296528875",
    appId: "1:162296528875:web:d33fe4891a953e5ef723ae",
    measurementId: "G-DPD98P54NY"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };