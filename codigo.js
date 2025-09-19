// --- ELEMENTOS DO DOM ---
const gridElement = document.getElementById('grid');
const wordsElement = document.getElementById('words');
const telaSelecao = document.getElementById('tela-selecao-tema');
const containerPrincipal = document.querySelector('.container-principal');
const botoesTema = document.querySelectorAll('.botao-tema');

// --- DADOS DOS TEMAS ---
const temas = {
    animais: ['GATO', 'LEAO', 'TIGRE', 'MACACO', 'ELEFANTE', 'ZEBRA'],
    cores: ['AZUL', 'VERDE', 'AMARELO', 'VERMELHO', 'ROXO'],
    alimentos: ['BANANA', 'ARROZ', 'FEIJAO', 'TOMATE']
};

// --- VARIÁVEIS DO JOGO ---
const gridSize = 12;
let palavrasEncontradas = [];
let selectedLetters = [];
let selectedPositions = [];
let isDragging = false;

// --- FUNÇÃO PRINCIPAL PARA INICIAR O JOGO ---
function iniciarJogo(tema) {
    telaSelecao.style.display = 'none';
    containerPrincipal.style.display = 'flex';
    gridElement.innerHTML = '';
    palavrasEncontradas = [];

    const wordsToFind = temas[tema];

    // Renderiza as palavras como spans
    wordsElement.innerHTML = wordsToFind
        .map(palavra => `<span class="palavra-lista" data-palavra="${palavra}">${palavra}</span>`)
        .join(' ');

    let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));

    function inserirPalavra(word) {
        const direcoes = ['horizontal', 'vertical', 'diagonal'];
        let colocado = false;
        while (!colocado) {
            const direcao = direcoes[Math.floor(Math.random() * direcoes.length)];
            let row = Math.floor(Math.random() * gridSize);
            let col = Math.floor(Math.random() * gridSize);
            if (direcao === 'horizontal' && col + word.length <= gridSize) {
                for (let i = 0; i < word.length; i++) grid[row][col + i] = word[i];
                colocado = true;
            } else if (direcao === 'vertical' && row + word.length <= gridSize) {
                for (let i = 0; i < word.length; i++) grid[row + i][col] = word[i];
                colocado = true;
            } else if (direcao === 'diagonal' && row + word.length <= gridSize && col + word.length <= gridSize) {
                for (let i = 0; i < word.length; i++) grid[row + i][col + i] = word[i];
                colocado = true;
            }
        }
    }

    wordsToFind.forEach(word => inserirPalavra(word));

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (!grid[row][col]) {
                grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = grid[row][col];
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Eventos para arrastar
            cell.addEventListener('mousedown', () => iniciarSelecao(cell));
            cell.addEventListener('mouseenter', () => continuarSelecao(cell));
            cell.addEventListener('mouseup', finalizarSelecao);

            gridElement.appendChild(cell);
        }
    }
}

// --- SELEÇÃO POR DESLIZE ---
function iniciarSelecao(cell) {
    isDragging = true;
    limparSelecao();
    selecionarCelula(cell);
}

function continuarSelecao(cell) {
    if (isDragging) {
        selecionarCelula(cell);
    }
}

function finalizarSelecao() {
    if (isDragging) {
        isDragging = false;
        verificarPalavra();
    }
}

function selecionarCelula(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    if (!cell.classList.contains('found')) {
        cell.classList.add('found');
        selectedLetters.push(cell.textContent);
        selectedPositions.push({ row, col });
    }
}

// --- VERIFICAÇÃO ---
function verificarPalavra() {
    const selectedWord = selectedLetters.join('').toUpperCase();
    const reversedWord = selectedLetters.slice().reverse().join('').toUpperCase();
    const wordsToFind = temas[document.body.dataset.temaAtual];

    if (!éSequênciaVálida(selectedPositions)) {
        limparSelecao();
        return;
    }

    if (wordsToFind && (wordsToFind.includes(selectedWord) || wordsToFind.includes(reversedWord))) {
        const palavraFinal = wordsToFind.includes(selectedWord) ? selectedWord : reversedWord;
        if (!palavrasEncontradas.includes(palavraFinal)) {
            palavrasEncontradas.push(palavraFinal);
            mostrarMensagem(`🎉 Você encontrou a palavra: ${palavraFinal}!`);

            // Marca a palavra encontrada na lista
            const span = document.querySelector(`.palavra-lista[data-palavra="${palavraFinal}"]`);
            if (span) span.classList.add('palavra-encontrada');
        }

        document.querySelectorAll('.cell.found').forEach(cell => {
            cell.classList.remove('found');
            cell.classList.add('word-complete');
        });
    }
    limparSelecao();

    if (palavrasEncontradas.length === wordsToFind.length) {
        setTimeout(() => {
            mostrarMensagemFinal("🏆 Parabéns! Você encontrou TODAS as palavras!");
        }, 700);
    }
}

// --- FUNÇÕES AUXILIARES ---
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

function limparSelecao() {
    selectedLetters = [];
    selectedPositions = [];
    document.querySelectorAll('.cell.found').forEach(cell => {
        cell.classList.remove('found');
    });
}

function voltarParaSelecao() {
    containerPrincipal.style.display = 'none';
    telaSelecao.style.display = 'block';
    gridElement.innerHTML = '';
    palavrasEncontradas = [];
    selectedLetters = [];
    selectedPositions = [];
    const msg = document.getElementById('mensagem');
    msg.style.display = 'none';
    msg.dataset.final = 'false';
}

function mostrarMensagem(texto) {
    const msg = document.getElementById('mensagem');
    if (msg.dataset.final === 'true') return;
    msg.textContent = texto;
    msg.style.display = 'block';
    setTimeout(() => {
        if (msg.dataset.final !== 'true') {
            msg.style.display = 'none';
        }
    }, 3000);
}

function mostrarMensagemFinal(texto) {
    const msg = document.getElementById('mensagem');
    msg.innerHTML = `
      <div style="margin-bottom: 10px;">${texto}</div>
      <button onclick="voltarParaSelecao()" style="padding: 8px 14px; background-color: #ffaa00; border: none; color: white; font-weight: bold; border-radius: 6px; cursor: pointer;">🔁 Jogar Novamente</button>
    `;
    msg.style.display = 'block';
    msg.style.backgroundColor = '#e0ffe0';
    msg.style.borderColor = '#28a745';
    msg.dataset.final = 'true'
}

// --- EVENTO DOS BOTÕES DE TEMA ---
botoesTema.forEach(botao => {
    botao.addEventListener('click', () => {
        const temaEscolhido = botao.dataset.tema;
        document.body.dataset.temaAtual = temaEscolhido;
        iniciarJogo(temaEscolhido);
    });
});





