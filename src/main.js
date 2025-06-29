import { populateTitle, populateIcon, themeToggle } from './utils.js';

//Dark theme toggle on body

themeToggle();
//Slider

const range = document.querySelector('.main__quiz-range');

function updateRangeBackground(value, minimum, maximum) {
  const min = minimum ? minimum : 0;
  const max = maximum ? maximum : 10;
  // const val = range.value;
  const val = value;
  const percent = ((val - min) / (max - min)) * 100;
  range.style.background = `linear-gradient(to right, var(--purple-600) ${percent}%, var(--btn-background) ${percent}%)`;
}

//Quiz data

let title = null,
  icon = null,
  questions = null;
let points = 0;
let nextQuestion = 0;

async function loadQuizData(subject, question) {
  try {
    const response = await fetch('/data.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const quizData = await response.json();

    ({ title, icon, questions } =
      quizData.quizzes.find(element => element.title === subject) || {});

    populateTitle(title);
    populateIcon(icon, title);
    populateQuestion(questions, question);
    populateOptions(questions, question);
    populateProgress(1, questions);
    updateRangeBackground(nextQuestion + 1, 0, questions.length);
  } catch (error) {
    console.log('Error fetching data:', error);
  }
}

const params = new URLSearchParams(window.location.search);
const subject = params.get('subject');

loadQuizData(subject, nextQuestion);

function populateQuestion(questions, currentQuestion) {
  const question = document.querySelector('.main__question');
  question.textContent = questions[currentQuestion].question;
}

function populateOptions(questions, currentQuestion) {
  const optionElements = document.querySelectorAll('.main__option-text');

  //Render each answer option
  optionElements.forEach((element, index) => {
    element.textContent = questions[currentQuestion].options[index];
  });
}

function populateProgress(number, questions) {
  const progressElement = document.querySelector('.main__progress');
  let current = number;
  let total = questions.length;
  progressElement.textContent = `Question ${current} of ${total}`;
}

//Validate the form when submitted
const form = document.querySelector('#quiz-form');
const submitButton = document.querySelector('.main__option--submit');
const errorMessage = document.querySelector('.main__error');

//Validate form
let isSubmitMode = true;

function validateForm(e) {
  e.preventDefault();

  //Checked radio element
  const checkedRadio = document.querySelector('.main__option-radio:checked');

  //Show error message if no option is selected and return
  if (!checkedRadio) {
    errorMessage.classList.remove('hidden');
    return;
  }

  // Checked elements continued
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

  //Correct option elements

  const correctAnswer = questions[nextQuestion].answer;
  const correctIndex = questions[nextQuestion].options.findIndex(
    option => option === questions[nextQuestion].answer
  );
  const optionElements = document.querySelectorAll('.main__option-btn');
  const optionLetter = document.querySelectorAll('.main__option-letter');
  const messageIcon = document.querySelectorAll('.main__option-icon');
  const correctElement = optionElements[correctIndex];
  const correctLetter = optionLetter[correctIndex];
  let correctIcon = messageIcon[correctIndex];

  //Other elements

  if (isSubmitMode) {
    //Validation logic

    if (answer === correctAnswer) {
      correctElement.classList.add('main__option-btn--correct');
      correctLetter.classList.add('main__option-letter--correct');
      correctIcon.style.backgroundImage =
        "url('./src/images/icon-correct.svg')";
      points += 1;
    } else {
      checkedRadioButton.classList.add('main__option-btn--incorrect');
      checkedRadioLetter.classList.add('main__option-letter--incorrect');
      correctElement.classList.add('main__option-btn--correct');
      correctIcon.style.backgroundImage =
        "url('./src/images/icon-correct.svg')";
      checkedRadioIcon.style.backgroundImage =
        "url('./src/images/icon-incorrect.svg')";
    }

    nextQuestion === questions.length
      ? (submitButton.textContent = 'Finish Quiz')
      : (submitButton.textContent = 'Next Question');

    //Remove error message
    errorMessage.classList.add('hidden');
    isSubmitMode = false;
  } else {
    //Load next question
    const numberOfQuestions = questions.length;
    console.log(numberOfQuestions);
    nextQuestion += 1;

    //Reset UI for new question
    resetUI();
    correctIcon.style.backgroundImage = '';
    checkedRadioIcon.style.backgroundImage = '';

    if (nextQuestion >= numberOfQuestions) {
      // window.open('score.html', '_blank');
      window.location.href = `score.html?subject=${encodeURIComponent(
        subject
      )}&score=${points}&total=${numberOfQuestions}`;
      return;
    }

    populateQuestion(questions, nextQuestion);
    populateOptions(questions, nextQuestion);
    populateProgress(nextQuestion + 1, questions);
    updateRangeBackground(nextQuestion + 1, 0, questions.length);

    submitButton.textContent = 'Submit Answer';
    isSubmitMode = true;
  }
}

form.addEventListener('submit', validateForm);

function resetUI() {
  //remove all modifier classes from option buttons
  document.querySelectorAll('.main__option-btn').forEach(btn => {
    btn.classList.remove(
      'main__option-btn--selected',
      'main__option-btn--correct',
      'main__option-btn--incorrect'
    );
  });

  document.querySelectorAll('.main__option-letter').forEach(letter => {
    letter.classList.remove(
      'main__option-letter--correct',
      'main__option-letter--incorrect'
    );
  });

  //Uncheck all radio buttons
  document.querySelectorAll('.main__option-radio').forEach(radio => {
    radio.checked = false;
  });

  //Hide error messages
  document.querySelector('main-error')?.classList.add('hidden');
}
