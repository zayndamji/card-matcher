const cardGrid = document.getElementById('card-grid');

let gridDimension = 4;
const gridArea = () => gridDimension * gridDimension;
let colors = [];

document.getElementById('generate-card-grid').addEventListener('click', generateCardGrid);
generateCardGrid();

document.getElementById('dimension-select').addEventListener('change', () => {
  gridDimension = parseInt(document.getElementById('dimension-select').value);
  generateCardGrid();
});

function generateCardGrid() {
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

    card.id = colors[i];
    card.classList.add('card');

    card.style.backgroundColor = 'black';
    card.style.backgroundImage = `url("card.png")`;
    card.style.backgroundPosition = 'center';
    card.style.backgroundSize = 'cover';

    card.onclick = () => {
      console.log(card.style.backgroundColor);
      if (card.style.backgroundColor == 'black') {
        card.style.backgroundImage = 'none';
        card.style.backgroundColor = `#${hexCodeToString(colors[i])}`;
      } else {
        card.style.backgroundImage = 'url("card.png")';
        card.style.backgroundColor = 'black';
      }
    };

    cardContainer.append(cardDummy, card);
    cardGrid.append(cardContainer);
  }
}

function generateColors() {
  colors = [];

  for (let i = 0; i < gridArea()/2; i++) {
    const color = getRandomInt(i*(16777215/(gridArea()/2)), (i+1)*(16777215/(gridArea()/2)));
    console.log(color);
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