
const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Trainer Marking Language",
      "Hyper Text Markup Language",
      "Hyper Text Marketing Language",
      "Hyper Text Markup Leveler",
    ],
    correct: 1,
  },

  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    correct: 3,
  },

  {
    question: "What does CSS stand for?",
    options: [
      "Central Style Sheets",
      "Cascading Style Sheets",
      "Cascading Simple Sheets",
      "Cars SUVs Sailboats",
    ],
    correct: 1,
  },

  {
    question: "Which is not a JavaScript data type?",
    options: ["Number", "Boolean", "Float", "String"],
    correct: 2,
  },

  {
    question: "Inside which HTML element do we put JavaScript?",
    options: ["<js>", "<javascript>", "<script>", "<code>"],
    correct: 2,
  },

  {
    question: "How do you write 'Hello World' in an alert box?",
    options: [
      "msg('Hello World')",
      "alertBox('Hello World')",
      "msgBox('Hello World')",
      "alert('Hello World')",
    ],
    correct: 3,
  },

  {
    question: "Which method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correct: 0,
  },
  {
    question: "How do you create a function in JavaScript?",
    options: [
      "function = myFunction()",
      "function myFunction()",
      "function:myFunction()",
      "create myFunction()",
    ],
    correct: 1,
  },

  {
    question: "Which operator is used for strict equality?",
    options: ["==", "=", "===", "!="],
    correct: 2,
  },

  {
    question: "What is the correct way to write a comment in JS?",
    options: ["<!-- comment -->", "// comment", "** comment **", "# comment"],
    correct: 1,
  },
 ];


let currentIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let notAttemptedCount = 0;
let timeLeft = 15;
let timerInterval = null;
let answered = false;


const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const resetBtn = document.getElementById("reset-btn");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const trackerEl = document.getElementById("question-tracker");
const progressFill = document.getElementById("progress-fill");

const highScoreDisplay = document.getElementById("high-score-display");
const finalScoreEl = document.getElementById("final-score");
const correctCountEl = document.getElementById("correct-count");
const wrongCountEl = document.getElementById("wrong-count");
const notAttemptedCountEl = document.getElementById("not-attempted-count");
const newHighScoreEl = document.getElementById("new-high-score");


function init() {
  const savedHighScore = localStorage.getItem("quizHighScore") || 0;
  highScoreDisplay.textContent = `High Score: ${savedHighScore}`;
}


function startQuiz() {
  currentIndex = 0;
  score = 0;
  correctCount = 0;
  wrongCount = 0;
  notAttemptedCount = 0;

  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  loadQuestion();
}


function loadQuestion() {
  answered = false;
  nextBtn.disabled = false; 

  const currentQuestion = questions[currentIndex];
  questionEl.textContent = currentQuestion.question;
  trackerEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  scoreEl.textContent = `Score: ${score}`;

  
  const progressPercent = (currentIndex / questions.length) * 100;
  progressFill.style.width = `${progressPercent}%`;

 
  optionsEl.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option-btn");
    btn.addEventListener("click", () => selectAnswer(index, btn));
    optionsEl.appendChild(btn);
  });

  startTimer();
}


function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 15;
  timerEl.textContent = `Timer: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Timer: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!answered) {
        handleTimeout();
      }
    }
  }, 1000);
}


function handleTimeout() {
  answered = true;
  const optionButtons = optionsEl.querySelectorAll(".option-btn");
  optionButtons.forEach((btn) => {
    btn.disabled = true;
  });

  notAttemptedCount++;

  currentIndex++;

  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
}


function selectAnswer(selectedIndex, btnEl) {
  if (answered) return;
  lockOptions(selectedIndex);
}

function lockOptions(selectedIndex) {
  answered = true;

  const currentQuestion = questions[currentIndex];
  const optionButtons = optionsEl.querySelectorAll(".option-btn");

  optionButtons.forEach((btn, index) => {
    btn.disabled = true;

    if (index === currentQuestion.correct) {
      btn.classList.add("correct");
    } else if (index === selectedIndex) {
      btn.classList.add("wrong");
    }
  });

  if (selectedIndex === -1) {
    notAttemptedCount++;
  } else if (selectedIndex === currentQuestion.correct) {
    score++;
    correctCount++;
  } else {
    wrongCount++;
  }

  scoreEl.textContent = `Score: ${score}`;
  nextBtn.disabled = false;
}

function nextQuestion() {
  if (!answered) {
    lockOptions(-1);
  }

  currentIndex++;

  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  clearInterval(timerInterval);

  progressFill.style.width = "100%";
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  finalScoreEl.textContent = `Your Score: ${score} / ${questions.length}`;
  correctCountEl.textContent = `Correct: ${correctCount}`;
  wrongCountEl.textContent = `Wrong: ${wrongCount}`;
  notAttemptedCountEl.textContent = `Not Attempted: ${notAttemptedCount}`;

  const savedHighScore = Number(localStorage.getItem("quizHighScore")) || 0;

  if (score > savedHighScore) {
    localStorage.setItem("quizHighScore", score);
    newHighScoreEl.classList.remove("hidden");
  } else {
    newHighScoreEl.classList.add("hidden");
  }
}


function resetQuiz() {
 
  localStorage.removeItem("quizHighScore");
  currentIndex = 0;
  score = 0;
  correctCount = 0;
  wrongCount = 0;
  notAttemptedCount = 0;

  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  init(); }

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
resetBtn.addEventListener("click", resetQuiz);
init();