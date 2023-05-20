export function darklightmode() {
  const switchInput = document.querySelector('#switch');
  const linkTag = document.querySelector('link');

  switchInput.addEventListener('change', () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
  });
}