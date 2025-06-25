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

//Validate form

function validateForm(e) {
  e.preventDefault();

  //Elements
  const checkedRadio = document.querySelector('.main__option-radio:checked');

  //Show error message if no option selected and return
  if (!checkedRadio) {
    errorMessage.classList.remove('hidden');
    return;
  }

  // Elements continued
  const checkedRadioLabel = checkedRadio.closest('label');
  const checkedRadioButton =
    checkedRadioLabel.querySelector('.main__option-btn');
  const checkedRadioText =
    checkedRadioLabel.querySelector('.main__option-text');
  const answer = checkedRadioText.textContent;
  const checkedRadioLetter = checkedRadioLabel.querySelector(
    '.main__option-letter'
  );
  const checkedRadioIcon =
    checkedRadioLabel.querySelector('.main__option-icon');

  //Fetching the correct option and its index
  const correctAnswer = questions[0].answer;
  const correctIndex = questions[0].options.findIndex(
    option => option === questions[0].answer
  );

  //Elements continued
  const optionElements = document.querySelectorAll('.main__option-btn');
  const optionLetter = document.querySelectorAll('.main__option-letter');
  const messageIcon = document.querySelectorAll('.main__option-icon');
  console.log(messageIcon);

  const correctElement = optionElements[correctIndex];
  const correctLetter = optionLetter[correctIndex];
  const correctIcon = messageIcon[correctIndex];
  console.log(correctIcon);

  //Validation logic
  if (answer === correctAnswer) {
    correctElement.classList.add('main__option-btn--correct');
    correctLetter.classList.add('main__option-letter--correct');

    correctIcon.style.backgroundImage = "url('./src/images/icon-correct.svg')";
    submitButton.textContent = 'Next Question';
  } else {
    checkedRadioButton.classList.add('main__option-btn--incorrect');
    checkedRadioLetter.classList.add('main__option-letter--incorrect');
    correctElement.classList.add('main__option-btn--correct');
    // correctLetter.classList.add('main__option-letter--correct');
    correctIcon.style.backgroundImage = "url('./src/images/icon-correct.svg')";

    checkedRadioIcon.style.backgroundImage =
      "url('./src/images/icon-incorrect.svg')";
    console.log(messageIcon);
    submitButton.textContent = 'Next Question';
  }

  //Remove error message
  errorMessage.classList.add('hidden');
}

form.addEventListener('submit', validateForm);
