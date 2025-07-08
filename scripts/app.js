// scripts/app.js

const questions = [
  {
    text: "What does DBMS stand for?",
    options: [
      "Database Management System",
      "Data Backup Management System",
      "Dynamic Backup Module Software",
      "Distributed Base Memory Service",
    ],
    correct: 0,
    timeout: 30,
    prize: 1000,
  },
  {
    text: "Which SQL command is used to remove a table from a database?",
    options: ["DELETE", "REMOVE", "DROP", "TRUNCATE"],
    correct: 2,
    timeout: 30,
    prize: 2000,
  },
  {
    text: "In OS, what is the purpose of a semaphore?",
    options: [
      "To allocate memory",
      "To prevent deadlock",
      "To control access to shared resources",
      "To manage virtual memory",
    ],
    correct: 2,
    timeout: 25,
    prize: 3000,
  },
  {
    text: "Which of the following is not a type of OS?",
    options: ["Batch OS", "Time-sharing OS", "Distributed OS", "Linked OS"],
    correct: 3,
    timeout: 25,
    prize: 5000,
  },
  {
    text: "Which of the following is a feature of OOP?",
    options: ["Encapsulation", "Compilation", "Modularity", "Pipelining"],
    correct: 0,
    timeout: 25,
    prize: 10000,
  },
  {
    text: "Which keyword is used in C++ to inherit a class?",
    options: ["inherits", "extend", "using", "public"],
    correct: 3,
    timeout: 20,
    prize: 20000,
  },
  {
    text: "Which normal form removes partial dependency?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correct: 1,
    timeout: 20,
    prize: 40000,
  },
  {
    text: "What is the full form of ACID in DBMS?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Accuracy, Clarity, Integrity, Durability",
      "Atomicity, Complexity, Indexing, Dependency",
      "Asynchronous, Consistency, Integrity, Durability",
    ],
    correct: 0,
    timeout: 20,
    prize: 80000,
  },
  {
    text: "Which C++ concept allows the same function name to work with different parameters?",
    options: [
      "Encapsulation",
      "Abstraction",
      "Function Overloading",
      "Inheritance",
    ],
    correct: 2,
    timeout: 15,
    prize: 160000,
  },
  {
    text: "Which OS scheduling algorithm gives each process a fixed time to execute?",
    options: ["FCFS", "SJF", "Round Robin", "Priority Scheduling"],
    correct: 2,
    timeout: 15,
    prize: 1000000,
  },
];

let currentQuestion = 0;
let currentMoney = 0;
let timeLeft = 0;
let timer;
let gameActive = false;
let lifelines = { fiftyFifty: true, skipQuestion: true };

// DOM
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameScreen = document.getElementById("gameScreen");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const optionsGrid = document.getElementById("optionsGrid");
const questionText = document.getElementById("questionText");
const currentMoneySpan = document.getElementById("currentMoney");
const finalMoneySpan = document.getElementById("finalMoney");
const timeLeftSpan = document.getElementById("timeLeft");
const messageDiv = document.getElementById("message");
const questionNumSpan = document.getElementById("questionNum");
const totalQuestionsSpan = document.getElementById("totalQuestions");
const fiftyFiftyBtn = document.getElementById("fiftyFifty");
const skipQuestionBtn = document.getElementById("skipQuestion");
const gameOverMessage = document.getElementById("gameOverMessage");

function initGame() {
  currentQuestion = 0;
  currentMoney = 0;
  lifelines = { fiftyFifty: true, skipQuestion: true };
  fiftyFiftyBtn.disabled = false;
  skipQuestionBtn.disabled = false;
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  gameOverScreen.style.display = "none";
  totalQuestionsSpan.textContent = questions.length;
  gameActive = true;
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestion >= questions.length)
    return endGame("You completed the quiz!");
  const q = questions[currentQuestion];
  questionText.textContent = q.text;
  questionNumSpan.textContent = currentQuestion + 1;
  timeLeft = q.timeout;
  timeLeftSpan.textContent = timeLeft;
  optionsGrid.innerHTML = "";
  gameActive = true;

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;
    btn.onclick = () => selectOption(i);
    optionsGrid.appendChild(btn);
  });

  startTimer();
}

function selectOption(i) {
  if (!gameActive) return;
  gameActive = false;
  clearInterval(timer);

  const q = questions[currentQuestion];
  const btns = optionsGrid.querySelectorAll("button");

  if (i === q.correct) {
    btns[i].classList.add("correct");
    currentMoney = q.prize;
    currentMoneySpan.textContent = currentMoney;
    showMessage("Correct! Well done!", "success");
    setTimeout(() => {
      currentQuestion++;
      loadQuestion();
    }, 1500);
  } else {
    btns[i].classList.add("wrong");
    btns[q.correct].classList.add("correct");
    setTimeout(() => {
      endGame(
        `Wrong answer! Correct answer was ${String.fromCharCode(
          65 + q.correct
        )}`
      );
    }, 2000);
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeLeftSpan.textContent = timeLeft;
    if (timeLeft <= 10) timeLeftSpan.parentElement.classList.add("warning");
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame("Time's up!");
    }
  }, 1000);
}

function useFiftyFifty() {
  if (!lifelines.fiftyFifty || !gameActive) return;
  lifelines.fiftyFifty = false;
  fiftyFiftyBtn.disabled = true;

  const q = questions[currentQuestion];
  const btns = optionsGrid.querySelectorAll("button");

  let removed = 0;
  for (let i = 0; i < btns.length && removed < 2; i++) {
    if (i !== q.correct) {
      btns[i].classList.add("hidden");
      removed++;
    }
  }
  showMessage("50:50 used! Two wrong options removed.", "success");
}

function useSkipQuestion() {
  if (!lifelines.skipQuestion || !gameActive) return;
  lifelines.skipQuestion = false;
  skipQuestionBtn.disabled = true;
  clearInterval(timer);
  currentQuestion++;
  loadQuestion();
}

function endGame(msg) {
  gameActive = false;
  clearInterval(timer);
  gameOverScreen.style.display = "block";
  gameScreen.style.display = "none";
  gameOverMessage.textContent = msg;
  finalMoneySpan.textContent = currentMoney;
}

function showMessage(msg, type) {
  messageDiv.textContent = msg;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = "block";
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 3000);
}

startBtn.addEventListener("click", initGame);
restartBtn.addEventListener("click", initGame);
fiftyFiftyBtn.addEventListener("click", useFiftyFifty);
skipQuestionBtn.addEventListener("click", useSkipQuestion);
