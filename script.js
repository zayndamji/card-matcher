const cardGrid = document.getElementById('card-grid');

const gridDimension = 4;
const gridArea = () => gridDimension * gridDimension;
let colors = [];

document.getElementById('generate-card-grid').addEventListener('click', generateCardGrid);
generateCardGrid();

function generateCardGrid() {
  cardGrid.textContent = '';

  generateColors();

  for (let i = 0; i < gridArea(); i++) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const cardDummy = document.createElement('div');
    cardDummy.classList.add('card-dummy');
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.backgroundColor = `#${hexCodeToString(colors[i])}`;
    card.id = colors[i];

    cardContainer.append(cardDummy, card);
    cardGrid.append(cardContainer);
  }
}

function generateColors() {
  colors = [];

  for (let i = 0; i < gridArea()/2; i++) {
    const color = getUniqueHexCode();
    colors.push(color, color);
  }

  shuffle(colors);
}

function getUniqueHexCode() {
  let isSimilar = true;
  let hex;

  while (isSimilar) {
    hex = getRandomHexCode();
    isSimilar = false;

    for (let i = 0; i < colors.length; i++) {
      if (Math.abs(hex - colors[i]) < 1000000) {
        console.log(hex, colors[i]);
        isSimilar = true;
        break;
      }
    }
  }

  return hex;
}

function hexCodeToString(hex) {
  return hex.toString(16).padStart(6, '0');
}

function getRandomHexCode() {
  return (Math.random() * 0xFFFFFF << 0);
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