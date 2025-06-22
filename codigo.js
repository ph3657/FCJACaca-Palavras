const gridSize = 12;
const wordsToFind = ['GIBI', 'LETRA', 'LIVRO'].map(w => w.toUpperCase());
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
  inserirPalavra(word);
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
let selectedPositions = [];

// Valida se a sequência é linha reta
function éSequênciaVálida(posicoes) {
  if (posicoes.length < 2) return true;

  const dx = posicoes[1].col - posicoes[0].col;
  const dy = posicoes[1].row - posicoes[0].row;

  for (let i = 2; i < posicoes.length; i++) {
    const dxi = posicoes[i].col - posicoes[i - 1].col;
    const dyi = posicoes[i].row - posicoes[i - 1].row;

    if (dxi !== dx || dyi !== dy) return false;
  }

  return true;
}

// Clique nas células
gridElement.addEventListener('click', (e) => {
  if (!e.target.classList.contains('cell')) return;

  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  e.target.classList.add('found');
  selectedLetters.push(e.target.textContent);
  selectedPositions.push({ row, col });

  const selectedWord = selectedLetters.join('').toUpperCase();
  const reversedWord = selectedLetters.slice().reverse().join('').toUpperCase();

  if (!éSequênciaVálida(selectedPositions)) {
    alert('As letras precisam estar em sequência na mesma linha, coluna ou diagonal!');
    limparSelecao();
    return;
  }

  if (wordsToFind.includes(selectedWord) || wordsToFind.includes(reversedWord)) {
    alert(`Você encontrou a palavra: ${selectedWord}`);

    // Marca as letras da palavra como completas
    document.querySelectorAll('.cell.found').forEach(cell => {
      cell.classList.remove('found');
      cell.classList.add('word-complete');
    });

    selectedLetters = [];
    selectedPositions = [];
  }
//Limpar automaticamente
  if (selectedLetters.length > 10) {
    limparSelecao();
  }
});

// Limpa seleção manualmente ou por erro
function limparSelecao() {
  selectedLetters = [];
  selectedPositions = [];
  document.querySelectorAll('.cell.found').forEach(cell => {
    cell.classList.remove('found');
  });
}

