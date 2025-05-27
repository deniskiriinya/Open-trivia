const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const correctSound = document.getElementById('correct-sound');
const wrongsound = document.getElementById('wrong-sound');
const nextBtn = document.getElementById('next-btn');
const scoreEl = document.getElementById('score');
const categorySelect = document.getElementById('category');
const startBtn = document.getElementById('start-btn');
const highScoreEl = document.getElementById('high-score');
let highScore = localStorage.getItem('quizHighScore') || 0;
highScoreEl.innerText = `High Score: ${highScore}`;

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerInterval;

// Fetch categories on page load
fetch('https://opentdb.com/api_category.php')
  .then(res => res.json())
  .then(data => {
    categorySelect.innerHTML = '<option value="">Any Category</option>';
    data.trivia_categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  });
startBtn.addEventListener('click', () => {
  const difficulty = document.getElementById('difficulty').value;
  const user = getCookie('quizUser');

  // Restrict difficulty levels
  if ((difficulty === 'medium' || difficulty === 'hard') && !user) {
    alert('Please log in to access Medium or Hard questions.');
    window.location.href = 'login.html';
    return;
  }

  currentQuestionIndex = 0;
  score = 0;
  scoreEl.innerText = "Score: 0";
  fetchQuestions();
});
const difficultySelect = document.getElementById('difficulty');
const user = getCookie('quizUser');
if (!user) {
  [...difficultySelect.options].forEach(opt => {
    if (opt.value === 'medium' || opt.value === 'hard') {
      opt.disabled = true;
    }
  });
}
if (!getCookie('quizUser')) {
  alert('Please log in to play the quiz.');
  window.location.href = 'login.html';
}

async function fetchQuestions() {
  const category = categorySelect.value;
  const difficulty = document.getElementById('difficulty').value;
  
  let url = `https://opentdb.com/api.php?amount=10&type=multiple`;
 if (category) url += `&category=${category}`;
if (difficulty) url += `&difficulty=${difficulty}`;

  const res = await fetch(url);
  const data = await res.json();
  questions = data.results;
  showQuestion();
}
function getCookie(name) {
    const cname = name + "=";
    const ca = decodeURIComponent(document.cookie).split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(cname) == 0) return c.substring(cname.length, c.length);
    }
    return "";
  }


function showQuestion() {
  resetState();
  starTimer();

  let currentQuestion = questions[currentQuestionIndex];
  questionEl.innerHTML = currentQuestion.question;

  const answers = [...currentQuestion.incorrect_answers];
  answers.push(currentQuestion.correct_answer);

  // Shuffle answers
  answers.sort(() => Math.random() - 0.5);

  answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = decodeHTML(answer);
    button.classList.add("btn");

    button.dataset.correct = answer === currentQuestion.correct_answer ? "true" : "false";

    button.addEventListener("click", selectAnswer);
    answersEl.appendChild(button);
  });
}
function starTimer() {
  clearInterval(timerInterval);
  timeLeft = 15;
  const timerEl = document.getElementById('timer');
  timerEl.innerText = `Time Left: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `Time Left: ${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      selectAnswer({ target: { dataset: { correct: 'false' } } });
      questionEl.innerText = 'Time is up!';
      nextBtn.style.display = 'block';
    }
  }, 1000);
}

function resetState() {
  nextBtn.style.display = 'none';
  while (answersEl.firstChild) {
    answersEl.removeChild(answersEl.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === 'true';


  if (isCorrect) {
    correctSound.play();
    selectedBtn.style.backgroundColor = 'green';
    score++;
    scoreEl.innerText = `Score: ${score}`;
  } else {
    wrongsound.play();
    selectedBtn.style.backgroundColor = 'red';
  }

  Array.from(answersEl.children).forEach(button => {
    button.disabled = true;
    if (button.dataset.correct === 'true') {
      button.style.backgroundColor = 'green';
    }
    
  });

  nextBtn.style.display = 'block';
}
function showScore() {
  resetState();
  questionEl.innerText = `Quiz Finished! Your Score: ${score}`;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('quizHighScore', highScore);
    highScoreEl.innerText = `High Score: ${highScore}`;
  }
  nextBtn.innerText = 'Play Again';
  nextBtn.style.display = 'block';
}
nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    questionEl.innerText = 'Quiz Completed!';
    answersEl.innerHTML = '';
    nextBtn.style.display = 'none';
  }
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

fetchQuestions();
document.getElementById('logout-btn').addEventListener('click', () => {
  // Clear the cookie
  document.cookie = "quizUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  // Optionally, clear localStorage or other data
  // localStorage.removeItem('quizHighScore');

  // Redirect to login page
  window.location.href = 'login.html';
});

