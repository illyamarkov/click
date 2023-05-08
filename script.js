const countElement = document.getElementById('count');
const incrementButton = document.getElementById('increment-btn');

let count = 0;

incrementButton.addEventListener('click', () => {
  count++;
  countElement.innerText = count;
});
