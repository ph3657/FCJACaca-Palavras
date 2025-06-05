// script.js

const gridSize = 10;
const wordsToFind = ['HTML', 'CSS', 'JS', 'WEB'];
const gridElement = document.getElementById('grid');
const wordsElement = document.getElementById('words');

// Mostrar palavras
wordsElement.textContent = wordsToFind.join(', ');

// Cria matriz de letras
let grid = Array.from({ length: gridSize }, () =>
  Array.from({ length: gridSize }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  )
);

// Insere palavras horizontalmente
wordsToFind.forEach((word, index) => {
  const row = index;
  const col = Math.floor(Math.random() * (gridSize - word.length));
  for (let i = 0; i < word.length; i++) {
    grid[row][col + i] = word[i];
  }
});

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

  if (selectedLetters.length > 8) {
    // Limpa seleção se passar de 8 letras
    selectedLetters = [];
    document.querySelectorAll('.cell').forEach(cell => {
      cell.classList.remove('found');
    });
  }
});
