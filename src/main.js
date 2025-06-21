//Dark theme toggle on body

const toggle = document.querySelector('#theme-toggle');

toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', toggle.checked);
});

//Slider

const range = document.querySelector('.main__quiz-range');

function updateRangeBackground() {
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const val = range.value;
  const percent = ((val - min) / (max - min)) * 100;
  range.style.background = `linear-gradient(to right, var(--purple-600) ${percent}%, var(--btn-background) ${percent}%)`;
}
range.addEventListener('input', updateRangeBackground);
updateRangeBackground(); // Call once to set initial state
