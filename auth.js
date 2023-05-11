import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import * as firebaseui from 'https://www.gstatic.com/firebasejs/ui/6.1.1/firebase-ui-auth.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";

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

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      return true;
    },
    uiShown: function() {
      document.getElementById('loader').style.display = 'none';
    }
  },
  signInFlow: 'popup',
  signInSuccessUrl: '/', // Redirect to home page on successful login
  signInOptions: [
    // List all the providers you want to enable:
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID
  ],
  tosUrl: '<your-tos-url>',
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

const ui = new firebaseui.auth.AuthUI(auth);
ui.start('#firebaseui-auth-container', uiConfig);
