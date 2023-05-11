import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Your web app's Firebase configuration
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
const auth = getAuth(app);

export { app, auth };
