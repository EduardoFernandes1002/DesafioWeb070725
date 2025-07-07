const altura = 25;  // use pares maiores para visual melhor
const largura = 51; // deve ser ímpar para gerar labirinto

let jogadorX = 1;
let jogadorY = 1;
let saidaX = largura - 2;
let saidaY = altura - 2;

let labirinto = [];
let vitorias = 0;
let melhorTempo = null;
let tempoInicio = null;
let intervalo;

// Inicializa labirinto com paredes (#)
function criarMatriz() {
  labirinto = [];
  for(let y=0; y<altura; y++) {
    let linha = [];
    for(let x=0; x<largura; x++) {
      linha.push('#');
    }
    labirinto.push(linha);
  }
}

// Gera labirinto usando Recursive Backtracker
function gerarLabirinto() {
  criarMatriz();

  // Marca todas as células como não visitadas (somente as 'células' em posições ímpares)
  let visitado = [];
  for(let y=0; y<altura; y++) {
    let linha = [];
    for(let x=0; x<largura; x++) {
      linha.push(false);
    }
    visitado.push(linha);
  }

  function podeVisitar(nx, ny) {
    return ny > 0 && ny < altura-1 && nx > 0 && nx < largura-1;
  }

  function vizinhos(celX, celY) {
    let viz = [];
    if(podeVisitar(celX, celY-2) && !visitado[celY-2][celX]) viz.push([celX, celY-2]);
    if(podeVisitar(celX, celY+2) && !visitado[celY+2][celX]) viz.push([celX, celY+2]);
    if(podeVisitar(celX-2, celY) && !visitado[celY][celX-2]) viz.push([celX-2, celY]);
    if(podeVisitar(celX+2, celY) && !visitado[celY][celX+2]) viz.push([celX+2, celY]);
    return viz;
  }

  function removerParede(x1, y1, x2, y2) {
    let mx = (x1 + x2) / 2;
    let my = (y1 + y2) / 2;
    labirinto[my][mx] = ' ';
  }

  // Começa no jogador (1,1)
  function backtracker(x, y) {
    visitado[y][x] = true;
    labirinto[y][x] = ' ';

    let viz = vizinhos(x, y);
    while(viz.length) {
      let idx = Math.floor(Math.random() * viz.length);
      let [nx, ny] = viz.splice(idx, 1)[0];
      if(!visitado[ny][nx]) {
        removerParede(x, y, nx, ny);
        backtracker(nx, ny);
      }
    }
  }

  backtracker(1,1);

  // Define saída como espaço
  labirinto[saidaY][saidaX] = 'S';
}

function renderizar() {
  let mapa = "";
  for(let y=0; y<altura; y++) {
    for(let x=0; x<largura; x++) {
      if(x === jogadorX && y === jogadorY) {
        mapa += "☺ "
      } else {
        mapa += labirinto[y][x] + " ";
      }
    }
    mapa += "\n";
  }
  document.getElementById("labirinto").textContent = mapa;
  document.getElementById("contador").textContent = vitorias;
}

function iniciarTimer() {
  tempoInicio = Date.now();
  clearInterval(intervalo);
  intervalo = setInterval(() => {
    const tempoAtual = ((Date.now() - tempoInicio) / 1000).toFixed(1);
    document.getElementById("tempo").textContent = tempoAtual;
  }, 100);
}

document.addEventListener("keydown", e => {
  const tecla = e.key;
  let nx = jogadorX;
  let ny = jogadorY;

  if(tecla === "ArrowUp") ny--;
  else if(tecla === "ArrowDown") ny++;
  else if(tecla === "ArrowLeft") nx--;
  else if(tecla === "ArrowRight") nx++;

  if(labirinto[ny][nx] !== "#") {
    jogadorX = nx;
    jogadorY = ny;
  }

  if(labirinto[jogadorY][jogadorX] === "S") {
    clearInterval(intervalo);
    const tempoFinal = (Date.now() - tempoInicio) / 1000;
    alert(`🎉 Você venceu em ${tempoFinal.toFixed(1)} segundos!`);

    if(melhorTempo === null || tempoFinal < melhorTempo) {
      melhorTempo = tempoFinal;
      document.getElementById("recorde").textContent = melhorTempo.toFixed(1);
    }

    vitorias++;
    reiniciar();
  }

  renderizar();
});

function desistir() {
  alert("😢 Você desistiu.");
  jogadorX = 1;
  jogadorY = 1;
  clearInterval(intervalo);
  renderizar();
}

function reiniciar() {
  jogadorX = 1;
  jogadorY = 1;
  gerarLabirinto();
  renderizar();
  iniciarTimer();
}

gerarLabirinto();
renderizar();
iniciarTimer();