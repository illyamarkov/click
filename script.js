import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { app, auth } from './firebaseInit.js';

document.getElementById('login-btn').addEventListener('click', function() {
  window.location.href = '/auth';
});

const db = getDatabase(app);

// testing is online

// db.ref().once('value').then(function() {
//   console.log('Read access granted!');
// }).catch(function(error) {
//   console.error('Read access denied: ' + error.message);
// });

// -=-=-

function writeUserData(userId, name) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name
  });
}

function setScore(score, val) {
  const db = getDatabase();
  set(ref(db, 'score'), score + val);
}

var cval = 0

function changeScore(val) {
  const scoreRef = ref(db, 'score');
  get(scoreRef).then((snapshot) => {
    const score = snapshot.val();
    console.log(score)
    setScore(score, val)
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
const intervalId = setInterval(function(){
  console.log(cState);
  if (cState === true){
    updateScore();
  }
  else {
    clearInterval(intervalId);
    showPopup("Server: :(", "The server failed to respond... it's probably down due to maintainance or player overload. \n \n Try refreshing the page. You will not automatically reconnect. \n \n In the meantime, look at this adorable cat and dog:", "/assets/catdog.svg");
  }
}, 100);