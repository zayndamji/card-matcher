// important elements
const root = document.querySelector(':root');
const cardGrid = document.getElementById('card-grid');

// grid generation
let gridDimension = 4;
const gridArea = () => Math.pow(gridDimension, 2);
let colors = [];

// frequently changing variables
let flippedCards = [];
let tries = 0;
let correct = 0;
let time = 0;

// register event listeners
document.getElementById('theme-select').addEventListener('change', changeTheme);
document.getElementById('dimension-select').addEventListener('change', changeDimension);
document.getElementById('generate-card-grid').addEventListener('click', generateCardGrid);

// start timer
setInterval(() => {
  if (gameIsActive()) {
    time += 1;
    updateDisplay();
  }
}, 1000);

// setup configuration from local storage
if (localStorage.getItem('theme')) {
  console.log('Loading theme from local storage.');
  document.getElementById('theme-select').value = localStorage.getItem('theme');
  changeTheme();
}

if (localStorage.getItem('dimension')) {
  console.log('Loading dimension from local storage.');
  document.getElementById('dimension-select').value = localStorage.getItem('dimension');
  changeDimension();
}

// start by generating card grid
generateCardGrid();

// update display
function updateDisplay() {
  document.getElementById('tries-counter').textContent = tries;
  document.getElementById('correct-counter').textContent = tries == 0 || correct == 0 ? '0' : ''+Math.round((correct / tries) * 100);
  document.getElementById('time-counter').textContent = time;
}

// update page theme
function changeTheme() {
  const theme = document.getElementById('theme-select').value;
  localStorage.setItem('theme', theme);

  if (theme == 'light') {
    root.style.setProperty('--text', 'black');
    root.style.setProperty('--background', 'white');
    root.style.setProperty('--border', 'black');
    root.style.setProperty('--card-background', 'white');
    root.style.setProperty('--card-url', 'url("cardBlack.png")');
  } else {
    root.style.setProperty('--text', 'white');
    root.style.setProperty('--background', 'rgb(22, 22, 22)');
    root.style.setProperty('--border', 'white');
    root.style.setProperty('--card-background', 'black');
    root.style.setProperty('--card-url', 'url("cardWhite.png")');
  }
}

// update grid dimension
function changeDimension() {
  const dimension = document.getElementById('dimension-select').value;
  localStorage.setItem('dimension', dimension);

  gridDimension = parseInt(dimension);
  generateCardGrid();
}

// re-generate grid of cards
function generateCardGrid() {
  flippedCards = [];
  tries = 0;
  correct = 0;
  time = 0;

  cardGrid.textContent = '';
  cardGrid.style.gridTemplateColumns = 'repeat(' + gridDimension + ', 1fr)';
  cardGrid.style.gap = (16 - gridDimension) + 'px';

  generateColors();

  for (let i = 0; i < gridArea(); i++) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const cardDummy = document.createElement('div');
    cardDummy.classList.add('card-dummy');

    const card = document.createElement('div');

    card.id = 'card' + i;
    card.classList.add('card');

    card.style.backgroundColor = 'var(--card-background)';
    card.style.backgroundImage = `var(--card-url)`;
    card.style.backgroundPosition = 'center';
    card.style.backgroundSize = 'cover';

    card.onclick = () => flipCard(i);

    cardContainer.append(cardDummy, card);
    cardGrid.append(cardContainer);
  }

  updateDisplay();
}

// generate list of semi-random colors
function generateColors() {
  colors = [];

  const numOfColors = gridArea()/2;
  for (let i = 0; i < numOfColors; i++) {
    const color = getRandomInt(i * (0xFFFFFF / numOfColors) + (0xFFFFFF / numOfColors) / 4, 
                              (i+1) * (0xFFFFFF / numOfColors) - (0xFFFFFF / numOfColors) / 4);
    console.log(`Index ${i}: #${hexCodeToString(color)}`);

    colors.push(color, color);
  }

  shuffle(colors);
}

// flip card at colors[cardIndex]
async function flipCard(cardIndex) {
  const card = document.getElementById('card' + cardIndex);

  if (flippedCards.length >= 2) return; // still processing previous cards

  if (card.style.backgroundColor != 'var(--card-background)') return; // not allowed to un-flip card

  flippedCards.push(card);
  card.style.backgroundImage = 'none';
  card.style.backgroundColor = '#' + hexCodeToString(colors[cardIndex]);

  if (flippedCards.length == 1) return; // wait until next card is flipped

  const firstCard = flippedCards[0];
  const secondCard = flippedCards[1];

  const firstCardColor = firstCard.style.backgroundColor;
  const secondCardColor = secondCard.style.backgroundColor;

  if (firstCardColor == secondCardColor) {
    firstCard.style.borderColor = 'lightgreen';
    secondCard.style.borderColor = 'lightgreen';
    correct += 1;
  } else {
    firstCard.style.borderColor = 'red';
    secondCard.style.borderColor = 'red';
    await sleep(500);
    firstCard.style.backgroundColor = 'var(--card-background)';
    firstCard.style.backgroundImage = `var(--card-url)`;
    firstCard.style.borderColor = 'var(--border)';
    secondCard.style.backgroundColor = 'var(--card-background)';
    secondCard.style.backgroundImage = `var(--card-url)`;
    secondCard.style.borderColor = 'var(--border)';
  }

  flippedCards = [];
  tries += 1;
  updateDisplay();
}

// utility functions

function gameIsActive() {
  for (const card of cardGrid.children) {
    if (card.children[1].style.backgroundColor == 'var(--card-background)') {
      return true;
    }
  }

  return false;
}

function hexCodeToString(hex) {
  return hex.toString(16).padStart(6, '0');
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}