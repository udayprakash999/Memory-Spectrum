const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const restartButton = document.getElementById('restart');
const trophyModal = document.getElementById('trophy-modal');
const closeModalButton = document.getElementById('close-modal');
const loseModal = document.getElementById('lose-modal');
const closeLoseModalButton = document.getElementById('close-lose-modal');

if (!gameBoard || !scoreElement || !timerElement || !restartButton || !trophyModal || !closeModalButton || !loseModal || !closeLoseModalButton) {
  console.error("One or more DOM elements are missing. Ensure the HTML matches the IDs in the script.");
  throw new Error("Initialization error: Missing DOM elements");
}

let colors = [
  'red', 'red', 'blue', 'blue',
  'green', 'green', 'yellow', 'yellow',
  'orange', 'orange', 'purple', 'purple',
  'pink', 'pink', 'cyan', 'cyan',
];
let score = 0;
let revealedCards = [];
let matchedCards = [];
let timeLeft = 60; // Timer set to 60 seconds
let timer;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  gameBoard.innerHTML = '';
  shuffle(colors);
  colors.forEach((color, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.color = color;
    card.dataset.index = index;
    card.addEventListener('click', handleCardClick);
    card.style.backgroundColor = ''; // Ensure no colors are visible initially
    gameBoard.appendChild(card);
  });
}

function handleCardClick(e) {
  const card = e.target;

  // Prevent clicking already matched or revealed cards
  if (
    revealedCards.length >= 2 || 
    matchedCards.includes(card.dataset.index) || 
    card.classList.contains('revealed')
  ) {
    return;
  }

  card.style.backgroundColor = card.dataset.color;
  card.classList.add('revealed');
  revealedCards.push(card);

  if (revealedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = revealedCards;
  if (card1.dataset.color === card2.dataset.color) {
    matchedCards.push(card1.dataset.index, card2.dataset.index);
    card1.classList.add('matched');
    card2.classList.add('matched');
    score++;
    scoreElement.textContent = score;
    checkWin(); // Check if all pairs are matched
  } else {
    setTimeout(() => {
      card1.style.backgroundColor = '';
      card2.style.backgroundColor = '';
      card1.classList.remove('revealed');
      card2.classList.remove('revealed');
    }, 500);
  }
  revealedCards = [];
}

function startTimer() {
  clearInterval(timer); // Clear any existing timer
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function checkWin() {
  if (matchedCards.length === colors.length) {
    clearInterval(timer);
    showTrophy();
  }
}

function showTrophy() {
  trophyModal.classList.add('show');
}

function showLoseMessage() {
  loseModal.classList.add('show');
}

function endGame() {
  if (matchedCards.length < colors.length) {
    showLoseMessage();
  }
}

function restartGame() {
  score = 0;
  timeLeft = 60; // Reset timer
  revealedCards = [];
  matchedCards = [];
  scoreElement.textContent = score;
  timerElement.textContent = timeLeft;
  createBoard();
  clearInterval(timer);
  startTimer();
}

closeModalButton.addEventListener('click', () => {
  trophyModal.classList.remove('show');
  restartGame();
});

closeLoseModalButton.addEventListener('click', () => {
  loseModal.classList.remove('show');
  restartGame();
});

restartButton.addEventListener('click', restartGame);

// Initialize the game
createBoard();
startTimer();
