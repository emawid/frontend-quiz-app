function populateTitle(title) {
  const header = document.querySelector('.header__topic-name');
  header.textContent = title;
}

function populateIcon(icon, title) {
  const iconImage = document.querySelector('.subject__icon');
  iconImage.src = `./src/images/${icon.split('/').pop()}`;
  iconImage.classList.remove(iconImage.classList.item(1));
  iconImage.classList.add(`subject__icon--${title.toLowerCase()}`);
}

function themeToggle() {
  const toggle = document.querySelector('#theme-toggle');

  //On page load, set theme from localStorage
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    toggle.checked = true;
  } else {
    document.body.classList.remove('dark');
    toggle.checked = false;
  }

  //Listen for toggle changes
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });
}

export { populateTitle, populateIcon, themeToggle };
