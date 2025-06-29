import { populateTitle, populateIcon, themeToggle } from './utils.js';

themeToggle();

const params = new URLSearchParams(window.location.search);
const score = params.get('score');
const total = params.get('total');
const subject = params.get('subject');

console.log(score, total, subject);

//Elements

//update UI with quiz subject and score

async function loadScoreData(subject) {
  const response = await fetch('./data.json');
  const data = await response.json();
  const quiz = data.quizzes.find(q => q.title === subject);
  console.log(quiz);

  if (quiz) {
    populateTitle(quiz.title);
    populateIcon(quiz.icon, quiz.title);
    populateScore(score, total, quiz.title, quiz.icon);
  }
}

loadScoreData(subject);

function populateScore(score, total, title, icon) {
  document.querySelector('.main__card-subject').textContent = title;
  document.querySelector('.main__card-score').textContent = score;
  document.querySelector('.main__card-total').textContent = `out of ${total}`;
  const cardIcon = document.querySelector('.main__card-wrapper .subject__icon');
  cardIcon.src = `./src/images/${icon.split('/').pop()}`;
  cardIcon.classList.remove(cardIcon.classList.item(1));
  cardIcon.classList.add(`subject__icon--${title.toLowerCase()}`);
}
