const ALTURA = 25;   // Altura do labirinto (usar valor ímpar para melhor resultado visual)
const LARGURA = 51;  // Largura do labirinto (usar valor ímpar para funcionamento correto)

let posJogadorX = 1;
let posJogadorY = 1;
let posSaidaX = LARGURA - 2;
let posSaidaY = ALTURA - 2;

let labirinto = [];
let vitorias = 0;
let melhorTempo = null;
let tempoInicio = null;
let intervalo;

// Inicializa a matriz cheia de paredes
function criarMatrizVazia() {
    labirinto = [];
    for (let y = 0; y < ALTURA; y++) {
        let linha = [];
        for (let x = 0; x < LARGURA; x++) {
            linha.push('#');
        }
        labirinto.push(linha);
    }
}

// Gera labirinto com algoritmo Recursive Backtracker
function gerarLabirinto() {
    criarMatrizVazia();

    const visitado = Array.from({ length: ALTURA }, () =>
        Array(LARGURA).fill(false)
    );

    function posicaoValida(x, y) {
        return y > 0 && y < ALTURA - 1 && x > 0 && x < LARGURA - 1;
    }

    function obterVizinhos(x, y) {
        const vizinhos = [];
        if (posicaoValida(x, y - 2) && !visitado[y - 2][x]) vizinhos.push([x, y - 2]);
        if (posicaoValida(x, y + 2) && !visitado[y + 2][x]) vizinhos.push([x, y + 2]);
        if (posicaoValida(x - 2, y) && !visitado[y][x - 2]) vizinhos.push([x - 2, y]);
        if (posicaoValida(x + 2, y) && !visitado[y][x + 2]) vizinhos.push([x + 2, y]);
        return vizinhos;
    }

    function removerParedeEntre(x1, y1, x2, y2) {
        const meioX = (x1 + x2) / 2;
        const meioY = (y1 + y2) / 2;
        labirinto[meioY][meioX] = ' ';
    }

    function esculpir(x, y) {
        visitado[y][x] = true;
        labirinto[y][x] = ' ';
        let listaVizinhos = obterVizinhos(x, y);
        while (listaVizinhos.length) {
            const idx = Math.floor(Math.random() * listaVizinhos.length);
            const [vizX, vizY] = listaVizinhos.splice(idx, 1)[0];
            if (!visitado[vizY][vizX]) {
                removerParedeEntre(x, y, vizX, vizY);
                esculpir(vizX, vizY);
            }
        }
    }
    esculpir(1, 1);
    labirinto[posSaidaY][posSaidaX] = 'S';
}

// Mostra o labirinto na tela
function renderizar() {
    let mapa = "";
    for (let y = 0; y < ALTURA; y++) {
        for (let x = 0; x < LARGURA; x++) {
            if (x === posJogadorX && y === posJogadorY) {
                mapa += "☺ ";
            } else {
                mapa += labirinto[y][x] + " ";
            }
        }
        mapa += "\n";
    }

    document.getElementById("labirinto").textContent = mapa;
    document.getElementById("contador").textContent = vitorias;
}

// Inicia o contador de tempo
function iniciarTimer() {
    tempoInicio = Date.now();
    clearInterval(intervalo);
    intervalo = setInterval(() => {
        const tempoAtual = ((Date.now() - tempoInicio) / 1000).toFixed(1);
        document.getElementById("tempo").textContent = tempoAtual;
    }, 100);
}

// Controle de movimento do jogador
document.addEventListener("keydown", (evento) => {
    const tecla = evento.key;
    let novoX = posJogadorX;
    let novoY = posJogadorY;

    if (tecla === "ArrowUp") {
        novoY--;
        console.log("Cima pressionada");
    } else if (tecla === "ArrowDown") {
        novoY++;
        console.log("Baixo pressionada");
    }
    else if (tecla === "ArrowLeft") {
        novoX--;
        console.log("Esquerda pressionada");
    }
    else if (tecla === "ArrowRight") {
        novoX++;
        console.log("Direita pressionada");
    }
    if (labirinto[novoY][novoX] !== "#") {
        posJogadorX = novoX;
        posJogadorY = novoY;
    }
    if (labirinto[posJogadorY][posJogadorX] === "S") {
        clearInterval(intervalo);
        const tempoFinal = (Date.now() - tempoInicio) / 1000;
        alert(`🎉 Você venceu em ${tempoFinal.toFixed(1)} segundos!`);

        if (melhorTempo === null || tempoFinal < melhorTempo) {
            melhorTempo = tempoFinal;
            document.getElementById("recorde").textContent = melhorTempo.toFixed(1);
        }
        vitorias++;
        reiniciar();
    }
    renderizar();
});

// Desistir e reiniciar
function desistir() {
    alert("😢 Você desistiu.");
    posJogadorX = 1;
    posJogadorY = 1;
    clearInterval(intervalo);
    renderizar();
}

function reiniciar() {
    posJogadorX = 1;
    posJogadorY = 1;
    gerarLabirinto();
    renderizar();
    iniciarTimer();
}

// Inicializa o jogo
gerarLabirinto();
renderizar();
iniciarTimer();
