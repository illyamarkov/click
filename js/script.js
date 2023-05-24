import { darklightmode } from './darklightmode.js';
import { app } from './firebase_init.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import { getDatabase, ref, get, onValue, runTransaction, set } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

//dark and light mode switch listener
darklightmode();

// Select the login button, popup container, and close button
const login_signup = document.querySelector('.login-container');
const usernameContainer = document.querySelector('.loggedIn');
const playerUsername = document.getElementById('usernameText');

const playerScore = document.getElementById('private-count');

const loginButton = document.querySelector('#login-button');
const loginContainer = document.querySelector('#login-menu');
const closeLogin = document.querySelector('#login-close');

const signupButton = document.querySelector('#signup-button');
const signupContainer = document.querySelector('#signup-menu');
const closeSignup = document.querySelector('#signup-close');

// Open the popup when the login button is clicked
loginButton.addEventListener('click', () => {
  loginContainer.style.opacity = '0';
  loginContainer.style.display = 'flex';
  setTimeout(() => {
    loginContainer.style.opacity = '1';
  }, 1);
});

// Close the popup when the close button is clicked
closeLogin.addEventListener('click', () => {
  loginContainer.style.opacity = '0';
  setTimeout(() => {
    loginContainer.style.display = 'none';
    loginContainer.style.opacity = '1';
  }, 500);
});

// Open the popup when the login button is clicked
signupButton.addEventListener('click', () => {
  signupContainer.style.opacity = '0';
  signupContainer.style.display = 'flex';
  setTimeout(() => {
    signupContainer.style.opacity = '1';
  }, 1);
});

// Close the popup when the close button is clicked
closeSignup.addEventListener('click', () => {
  signupContainer.style.opacity = '0';
  setTimeout(() => {
    signupContainer.style.display = 'none';
    signupContainer.style.opacity = '1';
  }, 500);
});

const analytics = getAnalytics(app);
const db = getDatabase();

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

// -=-=-=-=- AUTH -=-=-=-=-

const auth = getAuth();

function createUserOnDB(uid, name, email) {
  const db = getDatabase();
  console.log("Hello!");
  set(ref(db, 'users/' + uid), {
    name: name,
    email: email,
    score: 0
  });
}

var signupSubmitButton = document.querySelector('#signupForm button[type="submit"]');

// Add event listener to the submit button
signupSubmitButton.addEventListener('click', function(event) {
  var email = document.getElementById("email_signup").value;
  var password = document.getElementById("password_signup").value;
  var username = document.getElementById("username_signup").value;
  event.preventDefault(); // Prevent the form from submitting

  createUserWithEmailAndPassword(auth, email, password, username)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    
    // Store user data in the Realtime Database
    createUserOnDB(user.uid, username, email);

    signupContainer.style.opacity = '0';

    setTimeout(() => {
      signupContainer.style.display = 'none';
      signupContainer.style.opacity = '1';
    }, 500);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
});

var loginSubmitButton = document.querySelector('#loginForm button[type="submit"]');

var user = ""

// Add event listener to the submit button
loginSubmitButton.addEventListener('click', function(event) {
  var email = document.getElementById("email_login").value;
  var password = document.getElementById("password_login").value;
  event.preventDefault(); // Prevent the form from submitting

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    user = userCredential.user;
    console.log(user);

    const c_name = ref(db, 'users/' + user.uid + '/name');
    get(c_name).then((snapshot) => {
      playerUsername.innerText = snapshot.val();
    }).catch(function(error) {
      console.log("Error!");
    });

    login_signup.style.display = 'none';

    usernameContainer.style.display = 'flex';

    loginContainer.style.opacity = '0';

    const pScoreRef = ref(db, 'users/' + user.uid + '/score');

    onValue(pScoreRef, (snapshot) => {
      const score = snapshot.val();
      playerScore.innerText = score;
    }, {
      onlyOnce: false // Keep the listener active after the initial data is retrieved
    });

    setTimeout(() => {
      loginContainer.style.display = 'none';
      loginContainer.style.opacity = '1';
    }, 500);


    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
});

// =-=-=-=-= END AUTH =-=-=-=-=


// testing is online

// db.ref().once('value').then(function() {
//   console.log('Read access granted!');
// }).catch(function(error) {
//   console.error('Read access denied: ' + error.message);
// });

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
  if (user != ''){
    const pScoreRef = ref(db, 'users/' + user.uid + '/score');
    runTransaction(pScoreRef, (pScore) => {
      return pScore + val;
    }).catch((error) => {
      // showPopup("Server: :(", "The server failed to respond... it's probably down due to maintainance or player overload. \n \n Try refreshing the page. You will not automatically reconnect. \n \n In the meantime, look at this adorable cat and dog:", "/assets/catdog.svg");
    });
  }
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

// POPUP CODE

const popupContainer = document.querySelector('.popup-container');
const closeBtn = document.querySelector('.close-btn');
const popupImage = document.querySelector('.popup-image');

function showPopup(type, message, imageSrc) {
  popupContainer.style.opacity = '0';
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