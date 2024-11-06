const sleep = ms => new Promise(r => setTimeout(r, ms));

const cardGrid = document.getElementById('card-grid');

let gridDimension = 4;
const gridArea = () => gridDimension * gridDimension;
let colors = [];
let flippedCards = [];
let tries = 0;
let correct = 0;

document.getElementById('generate-card-grid').addEventListener('click', generateCardGrid);
generateCardGrid();

document.getElementById('dimension-select').addEventListener('change', changeDimension);

function changeDimension() {
  gridDimension = parseInt(document.getElementById('dimension-select').value);
  generateCardGrid();
}

function updateDisplay() {
  document.getElementById('tries-counter').textContent = tries;
  document.getElementById('correct-counter').textContent = tries == 0 || correct == 0 ? '0' : ''+Math.round((correct / tries) * 100);
}

function generateCardGrid() {
  flippedCards = [];
  tries = 0;
  correct = 0;

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

    card.style.backgroundColor = 'black';
    card.style.backgroundImage = `url("card.png")`;
    card.style.backgroundPosition = 'center';
    card.style.backgroundSize = 'cover';

    card.onclick = () => flipCard(i);

    cardContainer.append(cardDummy, card);
    cardGrid.append(cardContainer);
  }

  updateDisplay();
}

async function flipCard(cardIndex) {
  const card = document.getElementById('card' + cardIndex);

  if (flippedCards.length >= 2) return; // still processing previous cards

  if (card.style.backgroundColor != 'black') return; // not allowed to un-flip card

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
    firstCard.style.backgroundColor = 'black';
    firstCard.style.backgroundImage = `url("card.png")`;
    firstCard.style.borderColor = 'white';
    secondCard.style.backgroundColor = 'black';
    secondCard.style.backgroundImage = `url("card.png")`;
    secondCard.style.borderColor = 'white';
  }

  flippedCards = [];
  tries += 1;
  updateDisplay();
}

function generateColors() {
  colors = [];

  for (let i = 0; i < gridArea()/2; i++) {
    const color = getRandomInt(i*(16777215/(gridArea()/2)), (i+1)*(16777215/(gridArea()/2)));
    console.log(`Index ${i}: #${hexCodeToString(color)}`);

    colors.push(color, color);
  }

  shuffle(colors);
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