const switchInput = document.querySelector('#switch');
const linkTag = document.querySelector('link');

switchInput.addEventListener('change', () => {
  if (switchInput.checked) {
    linkTag.setAttribute('href', 'styles-dark.css');
  } else {
    linkTag.setAttribute('href', 'styles-light.css');
  }
});


// -=-=-=-=- CODE -=-=-=-=-


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import { getDatabase, ref, get, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// const auth = getAuth();
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

const db = getDatabase();

// testing is online

// db.ref().once('value').then(function() {
//   console.log('Read access granted!');
// }).catch(function(error) {
//   console.error('Read access denied: ' + error.message);
// });

// -=-=-


function writeUserData(userId, name) {
  const db = getDatabase();
  console.log("Hello!");
  set(ref(db, 'users/' + userId), {
    username: name
  });
}

function setScore(score, val) {
  const db = getDatabase();
  set(ref(db, 'score'), score + val);
}

var cval = 0

// function changeScore(val) {
//   const scoreRef = ref(db, 'score');
//   get(scoreRef).then((snapshot) => {
//     const score = snapshot.val();
//     // console.log(score)
//     setScore(score, val)
//   });
// }

function changeScore(val) {
  const scoreRef = ref(db, 'score');
  runTransaction(scoreRef, (currentScore) => {
    return currentScore + val;
  }).catch((error) => {
    // showPopup("Server: :(", "The server failed to respond... it's probably down due to maintainance or player overload. \n \n Try refreshing the page. You will not automatically reconnect. \n \n In the meantime, look at this adorable cat and dog:", "/assets/catdog.svg");
  });
}

var cState = true;

function updateScore() {
  const scoreRef = ref(db, 'score');
  get(scoreRef).then((snapshot) => {
    const score = snapshot.val();
    countElement.innerText = score;
  }).catch(function(error) {
    cState = false;
    console.log("Error!");
  });
}

get(ref(db, 'users/hello/username')).then((snapshot) => {
  const score = snapshot.val();
  // console.log(score)
});


/* -=-=-=-=-=- CODE -=-=-=-=-=- */

const countElement = document.getElementById('count');
const incrementButton = document.getElementById('increment-btn');
const decrementButton = document.getElementById('decrement-btn');

let count = 0;

incrementButton.addEventListener('click', () => {
  count++;
  changeScore(1);
});

decrementButton.addEventListener('click', () => {
  count--;
  changeScore(-1);
});
 
function update(cnt) {
  if (cnt === 420) {
    countElement.innerText = "420 BLAZE IT";
  }
  else if (cnt === 69) {
    countElement.innerText = "69 nice ;)";
  }
}

// POPUP CODE

const popupContainer = document.querySelector('.popup-container');
const closeBtn = document.querySelector('.close-btn');
const popupImage = document.querySelector('.popup-image');

function showPopup(type, message, imageSrc) {

  popupImage.src = imageSrc;
  popupContainer.style.display = 'flex';
  errorMSG.innerText = message;
  errorTYP.innerText = type;
  setTimeout(() => {
    popupContainer.style.opacity = '1';
  }, 300);
}

function hidePopup() {
  popupContainer.style.opacity = '0';
  setTimeout(() => {
    popupImage.src = '';
    popupContainer.style.display = 'none';
    popupContainer.style.opacity = '1';
  }, 300);
}

closeBtn.addEventListener('click', hidePopup);

// CHECK CODE

// const intervalId = setInterval(function(){
//   console.log(cState);
//   if (cState === true){
//     updateScore();
//   }
//   else {
//     clearInterval(intervalId);
//     showPopup("Server: :(", "The server failed to respond... it's probably down due to maintainance or player overload. \n \n Try refreshing the page. You will not automatically reconnect. \n \n In the meantime, look at this adorable cat and dog:", "/assets/catdog.svg");
//   }
// }, 100);

const scoreRef = ref(db, 'score');

onValue(scoreRef, (snapshot) => {
  const score = snapshot.val();
  countElement.innerText = score;
}, {
  onlyOnce: false // Keep the listener active after the initial data is retrieved
});


// onRejected(scoreRef, (error) => {
//   if (error.code === "permission_denied") {
//     showPopup("Access Denied", "You do not have permission to access the score data. \n \n Please contact an administrator for assistance.", "/assets/access_denied.svg");
//   } else {
//     showPopup("Error", "An error occurred while trying to retrieve the score data. \n \n Please try again later.", "/assets/error.svg");
//   }
// });