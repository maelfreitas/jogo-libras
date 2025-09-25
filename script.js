// --- 1. CONFIGURAÇÃO INICIAL ---
const jogoContainer = document.getElementById('jogo-container');
const placarFinalContainer = document.getElementById('placar-final-container');
const sinalVideo = document.getElementById('sinal-video');
const opcoesContainer = document.getElementById('opcoes-container');
const feedbackTexto = document.getElementById('feedback-texto');
const progressoTexto = document.getElementById('progresso-texto');
const placarFinalTexto = document.getElementById('placar-final-texto');
const jogarNovamenteBtn = document.getElementById('jogar-novamente-btn');

// Aumente esta lista para ter mais variedade nas opções erradas!
const TODOS_OS_SINAIS = [
    { video: 'sinais/Abacaxi.mp4', resposta: 'Abacaxi' },
    { video: 'sinais/Abraço.mp4', resposta: 'Abraço' },
    { video: 'sinais/Academia.mp4', resposta: 'Academia' },
    { video: 'sinais/Acenar.mp4', resposta: 'Acenar' }
];

const SINAIS_POR_RODADA = 5;
let sinaisDaRodada = [];
let indiceSinalAtual = 0;
let acertos = 0;

// --- 2. FUNÇÕES PRINCIPAIS DO JOGO ---

function iniciarJogo() {
    acertos = 0;
    indiceSinalAtual = 0;

    const sinaisEmbaralhados = TODOS_OS_SINAIS.sort(() => Math.random() - 0.5);
    sinaisDaRodada = sinaisEmbaralhados.slice(0, SINAIS_POR_RODADA);

    placarFinalContainer.classList.add('hidden');
    jogoContainer.classList.remove('hidden');

    mostrarProximoSinal();
}

function mostrarProximoSinal() {
    if (indiceSinalAtual < sinaisDaRodada.length) {
        const sinalAtual = sinaisDaRodada[indiceSinalAtual];
        sinalVideo.src = sinalAtual.video;
        feedbackTexto.textContent = '';
        progressoTexto.textContent = `Sinal ${indiceSinalAtual + 1} de ${SINAIS_POR_RODADA}`;

        gerarOpcoes();
    } else {
        mostrarPlacarFinal();
    }
}

function gerarOpcoes() {
    opcoesContainer.innerHTML = ''; // Limpa as opções anteriores
    const respostaCorreta = sinaisDaRodada[indiceSinalAtual].resposta;

    // Pega 3 respostas erradas aleatórias da lista principal
    const opcoesErradas = TODOS_OS_SINAIS
        .filter(sinal => sinal.resposta !== respostaCorreta) // Garante que a resposta correta não seja uma das erradas
        .sort(() => Math.random() - 0.5) // Embaralha
        .slice(0, 3) // Pega as 3 primeiras
        .map(sinal => sinal.resposta); // Pega apenas o texto da resposta

    // Junta a resposta correta com as erradas e embaralha de novo
    const todasAsOpcoes = [respostaCorreta, ...opcoesErradas].sort(() => Math.random() - 0.5);

    // Cria um botão para cada opção
    todasAsOpcoes.forEach(opcaoTexto => {
        const botao = document.createElement('button');
        botao.textContent = opcaoTexto;
        botao.classList.add('opcao-btn');
        botao.addEventListener('click', () => verificarResposta(botao, respostaCorreta));
        opcoesContainer.appendChild(botao);
    });
}

function verificarResposta(botaoClicado, respostaCorreta) {
    const respostaUsuario = botaoClicado.textContent;

    // Desabilita todos os botões para impedir cliques múltiplos
    const todosOsBotoes = document.querySelectorAll('.opcao-btn');
    todosOsBotoes.forEach(btn => btn.disabled = true);

    if (respostaUsuario === respostaCorreta) {
        acertos++;
        botaoClicado.classList.add('correto');
        feedbackTexto.textContent = 'Correto!';
        feedbackTexto.style.color = 'green';
    } else {
        botaoClicado.classList.add('errado');
        feedbackTexto.textContent = `Errado! A resposta era "${respostaCorreta}".`;
        feedbackTexto.style.color = 'red';
        // Mostra qual era a resposta correta
        todosOsBotoes.forEach(btn => {
            if (btn.textContent === respostaCorreta) {
                btn.classList.add('correto');
            }
        });
    }

    // Passa para o próximo sinal depois de um intervalo
    indiceSinalAtual++;
    setTimeout(mostrarProximoSinal, 2000); // Aumentei o tempo para o jogador ver o feedback
}

function mostrarPlacarFinal() {
    jogoContainer.classList.add('hidden');
    placarFinalContainer.classList.remove('hidden');
    placarFinalTexto.textContent = `Você acertou ${acertos} de ${SINAIS_POR_RODADA} sinais!`;
}


// --- 3. EVENTOS ---
document.addEventListener('DOMContentLoaded', iniciarJogo);
jogarNovamenteBtn.addEventListener('click', iniciarJogo);