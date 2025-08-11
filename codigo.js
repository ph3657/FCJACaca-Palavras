// --- ELEMENTOS DO DOM ---
const gridElement = document.getElementById('grid');
const wordsElement = document.getElementById('words');
const telaSelecao = document.getElementById('tela-selecao-tema');
const containerPrincipal = document.querySelector('.container-principal');
const botoesTema = document.querySelectorAll('.botao-tema');

// --- DADOS DOS TEMAS ---
const temas = {
    animais: ['GATO', 'LEAO', 'TIGRE', 'MACACO', 'ELEFANTE', 'ZEBRA'],
    cores: ['AZUL', 'VERDE', 'AMARELO', 'VERMELHO', 'ROXO'], // Exemplo para o futuro
    alimentos: ['BANANA', 'ARROZ', 'FEIJAO', 'TOMATE'] // Exemplo para o futuro
};

// --- VARIÁVEIS GLOBAIS DO JOGO ---
const gridSize = 12;
let palavrasEncontradas = [];
let selectedLetters = [];
let selectedPositions = [];

// --- FUNÇÃO PRINCIPAL PARA INICIAR O JOGO ---
function iniciarJogo(tema) {
    // 1. Esconder a tela de seleção e mostrar o jogo
    telaSelecao.style.display = 'none';
    containerPrincipal.style.display = 'flex';

    // 2. Limpar o grid e resetar o estado do jogo anterior
    gridElement.innerHTML = '';
    palavrasEncontradas = [];

    const wordsToFind = temas[tema];

    // 3. Mostrar as palavras do tema escolhido
    wordsElement.textContent = wordsToFind.join(', ');

    // 4. Criar a matriz e inserir as palavras (lógica que já existia)
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

    // 5. Preencher espaços vazios
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (!grid[row][col]) {
                grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    // 6. Renderizar a grade na tela
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
}


// --- LÓGICA DE SELEÇÃO DE LETRAS (não muda, mas fica aqui) ---

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

gridElement.addEventListener('click', (e) => {
    if (!e.target.classList.contains('cell')) return;

    // A lógica de clique, verificação de palavras, etc., continua a mesma
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    e.target.classList.add('found');
    selectedLetters.push(e.target.textContent);
    selectedPositions.push({ row, col });

    const selectedWord = selectedLetters.join('').toUpperCase();
    const reversedWord = selectedLetters.slice().reverse().join('').toUpperCase();
    
    // Pega a lista de palavras do tema atual
    const wordsToFind = temas[document.body.dataset.temaAtual];

    if (!éSequênciaVálida(selectedPositions)) {
        //alert('As letras precisam estar em sequência na mesma linha, coluna ou diagonal!');
        limparSelecao();
        return;
    }

    if (wordsToFind && (wordsToFind.includes(selectedWord) || wordsToFind.includes(reversedWord))) {
        const palavraFinal = wordsToFind.includes(selectedWord) ? selectedWord : reversedWord;
        if (!palavrasEncontradas.includes(palavraFinal)) {
            palavrasEncontradas.push(palavraFinal);
            mostrarMensagem(`🎉 Você encontrou a palavra: ${palavraFinal}!`);
        }
        document.querySelectorAll('.cell.found').forEach(cell => {
            cell.classList.remove('found');
            cell.classList.add('word-complete');
        });
        selectedLetters = [];
        selectedPositions = [];
        if (palavrasEncontradas.length === wordsToFind.length) {
            setTimeout(() => {
                mostrarMensagemFinal("🏆 Parabéns! Você encontrou TODAS as palavras!");
            }, 700);
        }
    }

    if (selectedLetters.length > 10) {
        limparSelecao();
    }
});

function limparSelecao() {
    selectedLetters = [];
    selectedPositions = [];
    document.querySelectorAll('.cell.found').forEach(cell => {
        cell.classList.remove('found');
    });
}
function voltarParaSelecao() {
    // 1. Esconde o container do jogo
    containerPrincipal.style.display = 'none';

    // 2. Mostra novamente a tela de seleção de tema
    telaSelecao.style.display = 'block';

    // 3. Limpa o conteúdo da grade para a próxima partida
    gridElement.innerHTML = '';

    // 4. Reseta as variáveis de estado do jogo
    palavrasEncontradas = [];
    selectedLetters = [];
    selectedPositions = [];

    // 5. Garante que a mensagem final de "parabéns" seja escondida
    const msg = document.getElementById('mensagem');
    msg.style.display = 'none';
    msg.dataset.final = 'false'; // Reseta o estado da mensagem final
}

// --- FUNÇÕES DE MENSAGEM (não mudam) ---
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

// --- EVENT LISTENERS PARA OS BOTÕES DE TEMA ---
botoesTema.forEach(botao => {
    botao.addEventListener('click', () => {
        const temaEscolhido = botao.dataset.tema;
        document.body.dataset.temaAtual = temaEscolhido; // Guarda o tema atual
        iniciarJogo(temaEscolhido);
    });
});

//quase morri bla


