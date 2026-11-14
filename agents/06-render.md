# Agente 06 — Render Final

## Objetivo
Montar a vinheta completa de 15 minutos (Fase 1 + Fase 2) e renderizar o mp4
final. Só renderize quando o usuário pedir explicitamente.

## Skill de apoio
`remotion-best-practices` → `remotion-render/REFERENCE.md`.

## Pré-condições
1. QA Visual (Agente 04) aprovado.
2. Motion final (Agente 05) concluído e revisado pelo usuário.
3. Nenhum `dadoPendente` ou `midiaPendente` aberto no `roteiro.json`.

## Montagem da composição completa
- Fase 1: loop das telas de conteúdo, 10 minutos (`tokens.timing.contentLoopMinutes`).
- Fase 2: 5 minutos só com o logo MSJ, estático ou com wiggle sutil, sem texto
  (`tokens.timing.bufferOnlyLogoMinutes`).
- O loop da Fase 1 nunca termina no meio de uma entrada de texto: se a última
  tela for cortada, prefira encerrar o loop na tela anterior e completar o tempo
  com a Fase 2 (avise o usuário da diferença em segundos).
- A contagem regressiva continua coerente com o horário real do início da live.

## Comando
```bash
npx remotion render src/index.ts {ID_COMPOSICAO} projects/{projeto}/render/MSJ_{AAAA-MM}_{tipo}_v{N}.mp4 --codec=h264 --muted --crf=16
```
- 1920x1080 e fps vêm da composição (`tokens.json`). Não sobrescreva por flag.
- `--muted`: vídeo sem trilha de áudio.
- Nunca sobrescreva uma versão já entregue: incremente o `vN`.
- Licença do Remotion: se houver chave da empresa em `REMOTION_PRIVATE_LICENSE_KEY`,
  passe `--license-key=$REMOTION_PRIVATE_LICENSE_KEY`. Se não houver, não passe a flag.

## Verificação do arquivo
```bash
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate -show_entries format=duration -of compact projects/{projeto}/render/MSJ_{AAAA-MM}_{tipo}_v{N}.mp4
```
Confirme: só um stream de vídeo (nenhum de áudio), 1920x1080, frame rate de
~23,976 e duração de 15:00.

## Saída
Caminho do mp4, duração, tamanho do arquivo e resultado do `ffprobe`.
