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

  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark', toggle.checked);
  });
}

export { populateTitle, populateIcon, themeToggle };
