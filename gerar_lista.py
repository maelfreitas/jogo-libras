import os

# --- CONFIGURAÇÕES ---
# Nome da pasta onde estão os vídeos.
PASTA_SINAIS = 'sinais'

# Nome do arquivo de saída que será gerado.
ARQUIVO_SAIDA = 'lista_sinais.txt'

# Extensão dos arquivos de vídeo que queremos listar.
EXTENSAO_VIDEO = '.mp4'
# --------------------

def gerar_lista_de_sinais():
    """
    Busca por vídeos na pasta de sinais e gera um arquivo de texto com a lista
    de nomes de arquivo para ser usado pelo jogo.
    """
    print("Iniciando a geração da lista de sinais...")

    # 1. Verifica se a pasta 'sinais' existe no local do script.
    if not os.path.isdir(PASTA_SINAIS):
        print(f"ERRO: A pasta '{PASTA_SINAIS}' não foi encontrada!")
        print("Certifique-se de que o script está na pasta principal do seu projeto.")
        return

    # 2. Lista todos os arquivos na pasta e filtra apenas os que terminam com a extensão desejada.
    try:
        todos_os_arquivos = os.listdir(PASTA_SINAIS)
        videos_encontrados = [arquivo for arquivo in todos_os_arquivos if arquivo.endswith(EXTENSAO_VIDEO)]
    except OSError as e:
        print(f"ERRO: Não foi possível ler a pasta '{PASTA_SINAIS}': {e}")
        return

    # 3. Ordena a lista de vídeos em ordem alfabética para manter o arquivo organizado.
    videos_encontrados.sort()

    if not videos_encontrados:
        print(f"AVISO: Nenhum vídeo com a extensão '{EXTENSAO_VIDEO}' foi encontrado na pasta '{PASTA_SINAIS}'.")
        # Mesmo se não encontrar nada, cria um arquivo vazio para não quebrar o jogo.
        with open(ARQUIVO_SAIDA, 'w', encoding='utf-8') as f:
            f.write('')
        print(f"O arquivo '{ARQUIVO_SAIDA}' foi gerado vazio.")
        return

    # 4. Escreve a lista de nomes de arquivo no arquivo de saída.
    try:
        with open(ARQUIVO_SAIDA, 'w', encoding='utf-8') as f:
            # Junta todos os nomes de arquivo com uma quebra de linha entre eles.
            f.write('\n'.join(videos_encontrados))

        print("-" * 30)
        print(f"SUCESSO! O arquivo '{ARQUIVO_SAIDA}' foi gerado/atualizado.")
        print(f"Total de sinais listados: {len(videos_encontrados)}")
        print("-" * 30)

    except IOError as e:
        print(f"ERRO: Não foi possível escrever no arquivo '{ARQUIVO_SAIDA}': {e}")


# Executa a função principal quando o script é chamado.
if __name__ == '__main__':
    gerar_lista_de_sinais()