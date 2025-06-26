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

let nextQuestion = 0;

async function loadQuizData(subject, question) {
  try {
    const response = await fetch('/public/data.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const quizData = await response.json();

    ({ title, icon, questions } =
      quizData.quizzes.find(element => element.title === subject) || {});

    popoulateTitle(title);
    populateIcon(icon, title);
    populateQuestion(questions, question);
    populateOptions(questions, question);
  } catch (error) {
    console.log('Error fetching data:', error);
  }
}

loadQuizData('JavaScript', nextQuestion); //TODO: replace with variable

function popoulateTitle(title) {
  const header = document.querySelector('.header__topic-name');
  header.textContent = title;
}

function populateIcon(icon, title) {
  const iconImage = document.querySelector('.subject__icon');
  iconImage.src = `./src/images/${icon.split('/').pop()}`;
  iconImage.classList.remove(iconImage.classList.item(1));
  iconImage.classList.add(`subject__icon--${title.toLowerCase()}`);
}

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

  //Correct elemnts

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

  if (isSubmitMode) {
    //Validation logic
    console.log(answer, correctAnswer);
    if (answer === correctAnswer) {
      correctElement.classList.add('main__option-btn--correct');
      correctLetter.classList.add('main__option-letter--correct');
      correctIcon.style.backgroundImage =
        "url('./src/images/icon-correct.svg')";
    } else {
      checkedRadioButton.classList.add('main__option-btn--incorrect');
      checkedRadioLetter.classList.add('main__option-letter--incorrect');
      correctElement.classList.add('main__option-btn--correct');
      correctIcon.style.backgroundImage =
        "url('./src/images/icon-correct.svg')";
      checkedRadioIcon.style.backgroundImage =
        "url('./src/images/icon-incorrect.svg')";
    }

    submitButton.textContent = 'Next Question';

    //Remove error message
    errorMessage.classList.add('hidden');
    isSubmitMode = false;
  } else {
    //Load next question
    const numberOfQuestions = questions.length;
    nextQuestion += 1;

    //Reset UI for new question
    resetUI();
    correctIcon.style.backgroundImage = '';
    checkedRadioIcon.style.backgroundImage = '';

    populateQuestion(questions, nextQuestion);
    populateOptions(questions, nextQuestion);

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
    console.log(letter);
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
