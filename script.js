const countElement = document.getElementById('count');
const incrementButton = document.getElementById('increment-btn');

let count = 0;

incrementButton.addEventListener('click', () => {
  count++;
  if (count === 420) {
    countElement.innerText = "420 BLAZE IT";
  }
  if (count === 69) {
      countElement.innerText = "69 nice ;)";
  }
  else{
    countElement.innerText = count;
  }
});