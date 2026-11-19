# Minuto Jeito Agi · Novembro — análise do roteiro

Quadro dentro do Momento Sempre Juntos: compilado das histórias do ano. O vídeo base (2:21.933,
23,976 fps, 1920×1080) traz a voz; o motion entra **nas janelas pretas do vídeo** com cartelas de
tela cheia, no estilo da V3 da vinheta de abertura (TextReveal por máscara, transição por forma
oficial sem opacidade, cacos de `brand/shapes`).

## Mapa das cenas (frames a 24000/1001)

| Cena | Janela | Frames | Duração | Fundo | Logo | Sync |
|---|---|---|---|---|---|---|
| 01a | 00:00.000–00:04.000 | 0–96 | 4,0 s | azul Agibank | agi, canto superior | voz, palavra a palavra |
| 01b | 00:05.000–00:06.000 | 120–144 | 1,0 s | azul Agibank | agi, canto superior | voz, palavra a palavra |
| 01c | 00:07.000–00:08.000 | 168–192 | 1,0 s | azul Agibank | agi, canto superior | voz, palavra a palavra |
| 02 | 00:29.320–00:36.953 | 703–886 | 7,6 s | cinza claro | Agir como empreendedor, topo | silêncio |
| 03 | 01:01.686–01:11.362 | 1479–1711 | 9,7 s | cinza claro | Crescer na jornada, topo, 84 px | silêncio |
| 04 | 01:36.429–01:44.437 | 2312–2504 | 8,0 s | cinza claro | Viver pelo cliente, topo, 84 px | silêncio |
| 05 | 02:12.000–02:17.000 | 3165–3285 | 5,0 s | azul Agibank | Minuto Jeito Agi, centro, maior | timecode fixo |
| Enc. | 02:18.100–02:21.933 | 3311–3403 | 3,8 s | azul Agibank | Agibank, centro | silêncio total |

As janelas de 02, 03 e 04 batem com os frames pretos medidos (29,3–37,0 / 61,7–71,4 / 96,4–104,4 s).
A abertura (0–8,3 s) também é preta. A Cena 05 (2:12–2:17) **não** está numa janela preta: a cartela
azul cobre o vídeo, e a voz continua por baixo.

## Como aplico a V3

- Cartelas de tela cheia; a transição entra **antes** do preto (forma oficial cresce com a cor do
  fundo da cartela, como a `TransicaoForma` da V3) e sai devolvendo o vídeo.
- 01a/01b/01c: All Type palavra a palavra, cada tela isolada (não acumula texto). Precisa do tempo de
  cada palavra na voz → depende do vídeo (transcrição manual, porque o whisperx está bloqueado).
- 02/03/04: texto azul Agibank centralizado sobre cinza claro, logo do pilar no topo, cacos no canto
  inferior (só formas de `brand/shapes`, sem sobrepor texto/logo).
- 05 → Encerramento: mesmo fundo azul; o bloco logo + texto sai e só o logo Agibank entra, centralizado.

## Logos recebidos e onde ficaram

- `brand/logos/minuto-jeito-agi-negative.svg` / `-positive.svg` (enviados agora)
- `brand/logos/agibank-negative-rgb.svg` / `-positive-rgb.svg` (enviados agora)
- `agir_como_empreendedor_*` e `viver_pelo_cliente_*` copiados dos assets oficiais do Estúdio
  (`agibank-motion-hub/assets/o_jeito_agi/logos`); `crescer_na_jornada_*` já existia aqui.

## Pendências (preciso de resposta antes do KV)

1. **Palavras em Bold** nas cenas 01a, 01b, 01c, 02 e 04: o roteiro diz "Light e Bold", mas não
   diz quais palavras. (03 e 05 estão definidas.)
2. **Entrega**: mp4 completo (vídeo + motion, **com o áudio da voz**) ou só as cartelas em .mov com
   alfa para montar no Premiere? Obs.: a regra "sem áudio" é da vinheta pré-live; aqui a voz é o
   conteúdo.
3. **Intervalos da abertura** (4–5 s e 6–7 s, ainda no preto): o fundo azul segue contínuo entre
   01a, 01b e 01c, com o texto trocando? É o que proponho.
4. **Logo Minuto Jeito Agi positivo** usa azul `#0064F9`, não o `#0064F5` da marca. Na cena 05 uso o
   negativo (branco + verde), então não afeta este vídeo; vale corrigir o arquivo na origem.
5. **Encerramento com logo Agibank** (e não o "agi" reduzido que o MSJ usa): sigo o roteiro, que
   registra a exceção de 2026-11-19.

## Próximo passo

Com o vídeo e o CLAUDE.md: medir as palavras da voz na abertura, montar o **KV estático** de cada
cena (storyboard, obrigatório antes de qualquer timing) e só depois animar.
