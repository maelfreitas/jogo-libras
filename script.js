// --- 1. CONFIGURAÇÃO INICIAL E ELEMENTOS DO DOM ---
const jogoContainer = document.getElementById('jogo-container');
const placarFinalContainer = document.getElementById('placar-final-container');
const sinalVideo = document.getElementById('sinal-video');
const opcoesContainer = document.getElementById('opcoes-container');
const feedbackTexto = document.getElementById('feedback-texto');
const progressoTexto = document.getElementById('progresso-texto');
const placarFinalTexto = document.getElementById('placar-final-texto');
const jogarNovamenteBtn = document.getElementById('jogar-novamente-btn');

const SINAIS_POR_RODADA = 5;

// Estas variáveis serão preenchidas depois que a lista for carregada
let TODOS_OS_SINAIS = [];
let sinaisDaRodada = [];
let indiceSinalAtual = 0;
let acertos = 0;

// --- 2. NOVA LÓGICA PARA CARREGAR SINAIS AUTOMATICAMENTE ---

async function carregarSinais() {
    try {
        // 1. Busca o conteúdo do nosso arquivo de índice
        const response = await fetch('lista_sinais.txt');
        const text = await response.text();

        // 2. Transforma o texto em um array de nomes de arquivo, removendo linhas vazias
        const nomesDosArquivos = text.split('\n').filter(nome => nome.trim() !== '');

        // 3. Converte o array de nomes de arquivo no nosso array de objetos de sinais
        TODOS_OS_SINAIS = nomesDosArquivos.map(nomeArquivo => {
            // Remove a extensão .mp4
            let resposta = nomeArquivo.replace('.mp4', '');
            // Troca hífens por espaços
            resposta = resposta.replace(/-/g, ' ');

            return {
                video: `sinais/${nomeArquivo}`,
                resposta: resposta
            };
        });

        console.log('Sinais carregados com sucesso:', TODOS_OS_SINAIS);

    } catch (error) {
        console.error('Erro ao carregar a lista de sinais:', error);
        // Exibe uma mensagem de erro para o usuário caso o arquivo não seja encontrado
        jogoContainer.innerHTML = '<p style="color: red;">Não foi possível carregar os sinais. Verifique o arquivo lista_sinais.txt.</p>';
    }
}


// --- 3. FUNÇÕES PRINCIPAIS DO JOGO (praticamente inalteradas) ---

function iniciarJogo() {
    if (TODOS_OS_SINAIS.length < SINAIS_POR_RODADA) {
        jogoContainer.innerHTML = `<p style="color: orange;">Não há sinais suficientes para iniciar uma rodada. Adicione pelo menos ${SINAIS_POR_RODADA} sinais.</p>`;
        return;
    }

    acertos = 0;
    indiceSinalAtual = 0;

    const sinaisEmbaralhados = TODOS_OS_SINAIS.sort(() => Math.random() - 0.5);
    sinaisDaRodada = sinaisEmbaralhados.slice(0, SINAIS_POR_RODADA);

    placarFinalContainer.classList.add('hidden');
    jogoContainer.classList.remove('hidden');

    mostrarProximoSinal();
}

// O resto das funções (mostrarProximoSinal, gerarOpcoes, verificarResposta, etc.)
// permanecem exatamente as mesmas da versão anterior.
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
    opcoesContainer.innerHTML = '';
    const respostaCorreta = sinaisDaRodada[indiceSinalAtual].resposta;

    const opcoesErradas = TODOS_OS_SINAIS
        .filter(sinal => sinal.resposta !== respostaCorreta)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(sinal => sinal.resposta);

    const todasAsOpcoes = [respostaCorreta, ...opcoesErradas].sort(() => Math.random() - 0.5);

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
        todosOsBotoes.forEach(btn => {
            if (btn.textContent === respostaCorreta) {
                btn.classList.add('correto');
            }
        });
    }

    indiceSinalAtual++;
    setTimeout(mostrarProximoSinal, 2000);
}

function mostrarPlacarFinal() {
    jogoContainer.classList.add('hidden');
    placarFinalContainer.classList.remove('hidden');
    placarFinalTexto.textContent = `Você acertou ${acertos} de ${SINAIS_POR_RODADA} sinais!`;
}

// --- 4. INICIALIZAÇÃO DO JOGO ---

// Adiciona o evento para o botão de jogar novamente
jogarNovamenteBtn.addEventListener('click', iniciarJogo);

// Função principal que organiza o carregamento e início do jogo
async function inicializar() {
    await carregarSinais(); // Espera os sinais serem carregados
    iniciarJogo();          // Só então inicia o jogo
}

// Inicia todo o processo quando a página carrega
inicializar();