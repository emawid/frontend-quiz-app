//Dark theme toggle on body

const toggle = document.querySelector('#theme-toggle');

toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', toggle.checked);
});
