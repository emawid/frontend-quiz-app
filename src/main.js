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
  // const val = range.value;
  const val = 70; //TODO: replace with variable
  const percent = ((val - min) / (max - min)) * 100;
  range.style.background = `linear-gradient(to right, var(--purple-600) ${percent}%, var(--btn-background) ${percent}%)`;
}

updateRangeBackground(); // Call once to set initial state

//Quiz data

let title = null,
  icon = null,
  questions = null;

async function loadQuizData(subject) {
  try {
    const response = await fetch('/public/data.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const quizData = await response.json();

    ({ title, icon, questions } =
      quizData.quizzes.find(element => element.title === subject) || {});

    popoulateTitle(title);
    populateIcon(icon, title);
    populateQuestion(questions);
    populateOptions(questions);
  } catch (error) {
    console.log('Error fetching data:', error);
  }
}

loadQuizData('CSS'); //TODO: replace with variable

// console.log(quizData);

function popoulateTitle(title) {
  const header = document.querySelector('.header__topic-name');
  header.textContent = title;
}

// src="./src/images/icon-accessibility.svg"

function populateIcon(icon, title) {
  const iconImage = document.querySelector('.subject__icon');
  iconImage.src = `./src/images/${icon.split('/').pop()}`;
  iconImage.classList.remove(iconImage.classList.item(1));
  iconImage.classList.add(`subject__icon--${title.toLowerCase()}`);
}

function populateQuestion(questions) {
  const question = document.querySelector('.main__question');
  question.textContent = questions[0].question;
}

function populateOptions(questions) {
  const optionElements = document.querySelectorAll('.main__option-text');

  //Render each answer option
  optionElements.forEach((element, index) => {
    element.textContent = questions[0].options[index];
  });
}

//Validate the form when submitted
const form = document.querySelector('#quiz-form');
const submitButton = document.querySelector('.main__option--submit');

const errorMessage = document.querySelector('.main__error');

function validateForm(e) {
  //prevent browser from refreshing the page
  e.preventDefault();

  const checkedRadio = document.querySelector('.main__option-radio:checked');

  //Show error message if no option selected
  if (!checkedRadio) {
    errorMessage.classList.remove('main__error--hidden');
    return;
  }
  //validate the correct answer
  const correctAnswer = questions[0].answer;
  const correctIndex = questions[0].options.findIndex(
    option => option === questions[0].answer
  );
  const optionElements = document.querySelectorAll('.main__option-btn');
  const correctElement = optionElements[correctIndex];

  console.log(correctElement);

  const checkedRadioLabel = checkedRadio.closest('label');
  const checkedRadioButton =
    checkedRadioLabel.querySelector('.main__option-btn');
  const answer =
    checkedRadioLabel.querySelector('.main__option-text').textContent;

  if (answer === correctAnswer) {
    console.log('answer is correct');
    correctElement.classList.add('main__option-btn--correct');
    submitButton.textContent = 'Next Question';
  } else {
    console.log('answer is incorrect');
    checkedRadioButton.classList.add('main__option-btn--incorrect');
    correctElement.classList.add('main__option-btn--correct');
    submitButton.textContent = 'Next Question';
  }
  //Remove error message
  errorMessage.classList.add('main__error--hidden');
}

form.addEventListener('submit', validateForm);
