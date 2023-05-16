export function darklightmode() {
  const switchInput = document.querySelector('#switch');
  const linkTag = document.querySelector('link');

  switchInput.addEventListener('change', () => {
    if (switchInput.checked) {
      linkTag.setAttribute('href', 'css/styles-dark.css');
    } else {
      linkTag.setAttribute('href', 'css/styles-light.css');
    }
  });
}