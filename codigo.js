const temas = {
    animais: ["CACHORRO", "GATO", "ELEFANTE", "LEAO", "TIGRE", "COBRA"],
    frutas: ["MANGA", "UVA", "BANANA", "LARANJA", "ABACAXI", "MORANGO"],
    cores: ["AZUL", "VERDE", "AMARELO", "PRETO", "BRANCO", "ROSA"]
};

let grade = [];
let palavras = [];
let selecionadas = [];
let palavrasEncontradas = [];

document.getElementById("iniciar").addEventListener("click", iniciarJogo);

function iniciarJogo() {
    const temaSelecionado = document.getElementById("tema").value;
    if (!temaSelecionado) {
        alert("Escolha um tema antes de iniciar!");
        return;
    }
    palavras = [...temas[temaSelecionado]];
    gerarGrade(10, 10);
    mostrarPalavras();
}

function gerarGrade(linhas, colunas) {
    grade = Array.from({ length: linhas }, () => Array(colunas).fill(''));

    // Posiciona palavras
    palavras.forEach(palavra => {
        let colocada = false;
        while (!colocada) {
            const dir = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal
            const x = Math.floor(Math.random() * linhas);
            const y = Math.floor(Math.random() * colunas);

            if (podeColocar(palavra, x, y, dir, linhas, colunas)) {
                for (let i = 0; i < palavra.length; i++) {
                    if (dir === 0) grade[x][y + i] = palavra[i];
                    if (dir === 1) grade[x + i][y] = palavra[i];
                    if (dir === 2) grade[x + i][y + i] = palavra[i];
                }
                colocada = true;
            }
        }
    });

    // Preenche com letras aleatórias
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < linhas; i++) {
        for (let j = 0; j < colunas; j++) {
            if (grade[i][j] === '') {
                grade[i][j] = letras[Math.floor(Math.random() * letras.length)];
            }
        }
    }

    // Renderiza
    const container = document.getElementById("grade-container");
    container.innerHTML = '';
    grade.forEach((linha, i) => {
        linha.forEach((letra, j) => {
            const celula = document.createElement("div");
            celula.classList.add("celula");
            celula.textContent = letra;
            celula.dataset.x = i;
            celula.dataset.y = j;
            celula.addEventListener("click", selecionarCelula);
            container.appendChild(celula);
        });
    });
}

function podeColocar(palavra, x, y, dir, linhas, colunas) {
    if (dir === 0 && y + palavra.length > colunas) return false;
    if (dir === 1 && x + palavra.length > linhas) return false;
    if (dir === 2 && (x + palavra.length > linhas || y + palavra.length > colunas)) return false;

    for (let i = 0; i < palavra.length; i++) {
        let letraExistente;
        if (dir === 0) letraExistente = grade[x][y + i];
        if (dir === 1) letraExistente = grade[x + i][y];
        if (dir === 2) letraExistente = grade[x + i][y + i];
        if (letraExistente && letraExistente !== '' && letraExistente !== palavra[i]) return false;
    }
    return true;
}

function selecionarCelula(e) {
    const celula = e.target;
    celula.classList.toggle("selecionada");
    const pos = { x: parseInt(celula.dataset.x), y: parseInt(celula.dataset.y) };
    selecionadas.push(pos);

    verificarPalavra();
}

function verificarPalavra() {
    let palavraSelecionada = "";
    selecionadas.forEach(pos => {
        palavraSelecionada += grade[pos.x][pos.y];
    });

    if (palavras.includes(palavraSelecionada)) {
        palavrasEncontradas.push(palavraSelecionada);
        selecionadas = [];
        document.querySelectorAll(".selecionada").forEach(c => c.classList.remove("selecionada"));
        atualizarLista();
    }
}

function mostrarPalavras() {
    const container = document.getElementById("palavras-container");
    container.innerHTML = "<strong>Palavras para encontrar:</strong><br>" + palavras.join(", ");
}

function atualizarLista() {
    const container = document.getElementById("palavras-container");
    container.innerHTML = "<strong>Palavras para encontrar:</strong><br>" +
        palavras.map(p => palavrasEncontradas.includes(p) ? `<span class="encontrada">${p}</span>` : p).join(", ");
}

//quase morri bla


