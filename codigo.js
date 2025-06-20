const gridSize = 10;
const wordsToFind = ['GIBI', 'LETRA', 'LIVRO'];
const gridElement = document.getElementById('grid');
const wordsElement = document.getElementById('words');

// Mostrar palavras
wordsElement.textContent = wordsToFind.join(', ');

// Cria matriz vazia
let grid = Array.from({ length: gridSize }, () =>
  Array.from({ length: gridSize }, () => '')
);

// Função que insere palavras em direções aleatórias
function inserirPalavra(word) {
  const direcoes = ['horizontal', 'vertical', 'diagonal'];
  let colocado = false;

  while (!colocado) {
    const direcao = direcoes[Math.floor(Math.random() * direcoes.length)];
    let row = Math.floor(Math.random() * gridSize);
    let col = Math.floor(Math.random() * gridSize);

    if (direcao === 'horizontal' && col + word.length <= gridSize) {
      for (let i = 0; i < word.length; i++) {
        grid[row][col + i] = word[i];
      }
      colocado = true;
    } else if (direcao === 'vertical' && row + word.length <= gridSize) {
      for (let i = 0; i < word.length; i++) {
        grid[row + i][col] = word[i];
      }
      colocado = true;
    } else if (direcao === 'diagonal' && row + word.length <= gridSize && col + word.length <= gridSize) {
      for (let i = 0; i < word.length; i++) {
        grid[row + i][col + i] = word[i];
      }
      colocado = true;
    }
  }
}

// Insere as palavras na grade
wordsToFind.forEach(word => {
  inserirPalavra(word.toUpperCase());
});

// Preenche espaços vazios com letras aleatórias
for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
    if (!grid[row][col]) {
      grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
  }
}

// Renderiza a grade na tela
for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = grid[row][col];
    cell.dataset.row = row;
    cell.dataset.col = col;
    gridElement.appendChild(cell);
  }
}

// Armazena a seleção atual
let selectedLetters = [];

// Clique nas células
gridElement.addEventListener('click', (e) => {
  if (!e.target.classList.contains('cell')) return;

  e.target.classList.add('found');
  selectedLetters.push(e.target.textContent);

  const selectedWord = selectedLetters.join('');
  if (wordsToFind.includes(selectedWord)) {
    alert(`Você encontrou a palavra: ${selectedWord}`);
    selectedLetters = [];
  }

  if (selectedLetters.length > 10) {
    selectedLetters = [];
    document.querySelectorAll('.cell').forEach(cell => {
      cell.classList.remove('found');
    });
  }
});
