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
    card.style.backgroundColor = colors[i];

    cardContainer.append(cardDummy, card);
    cardGrid.append(cardContainer);
  }
}

function generateColors() {
  colors = [];

  for (let i = 0; i < gridArea()/2; i++) {
    const color = getRandomHexCode();
    colors.push(color, color);
  }

  shuffle(colors);
}

function getRandomHexCode() {
  return '#'+ (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}