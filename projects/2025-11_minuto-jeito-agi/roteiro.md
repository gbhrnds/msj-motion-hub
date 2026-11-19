# Roteiro de Motion — Minuto Jeito Agi Novembro

## Metadados técnicos do vídeo base
- Arquivo: `minuto-jeito-agi-novembro.mp4`
- Duração total: 00:02:21.93
- FPS: 23.98 (NTSC) — toda conversão timecode→frame usa esse valor
- Resolução: 1920x1080

## Regras gerais
- Transição entra antes do vídeo ficar preto, nunca depois.
- All Type sincronizado à voz só nas cenas indicadas como tal. No resto, motion
  entra em janela de silêncio/timecode fixo.
- Nunca viúva em quebra de linha (`quebraBoa`).
- Logo de marca (Agibank): canto inferior direito. Logo de programa: topo.
- Seguir sempre `brand/boas-praticas-visuais.md` e `brand/tokens.json`.
- Ordem de implementação: 01a → 01b → 01c → 02 → 03 → 04 → 05 → Encerramento.
- **Fluxo obrigatório**: Key Visual (frame estático aprovado) antes de qualquer
  timing de animação ser definido. Ver `storyboard/`.

---

## CENA 01 — Abertura (dividida em 3 telas sequenciais, round 2026-11-19)

Cada tela é um frame de repouso isolado — não acumula o texto da anterior.

### Cena 01a
| Campo | Valor |
|---|---|
| Timecode | 00:00.000 – 00:04.000 |
| Sincronismo | Voz — All Type palavra a palavra |
| Texto | "Em um ano, a gente viu o Jeito Agi" (linha 1) / "acontecer de verdade." (linha 2) — quebra manual, centralizado |
| Fundo | Azul Agibank |
| Logo | AGI, canto superior |
| Fonte | Agibank Sans — Light e Bold |

### Cena 01b
| Campo | Valor |
|---|---|
| Timecode | 00:05.000 – 00:06.000 |
| Sincronismo | Voz — All Type palavra a palavra |
| Texto | "Não em apresentações ou falas." — frase única, centralizada |
| Fundo | Azul Agibank |
| Logo | AGI, canto superior |
| Fonte | Agibank Sans — Light e Bold |

### Cena 01c
| Campo | Valor |
|---|---|
| Timecode | 00:07.000 – 00:08.000 |
| Sincronismo | Voz — All Type palavra a palavra |
| Texto | "Mas em pessoas." — frase única, centralizada |
| Fundo | Azul Agibank |
| Logo | AGI, canto superior |
| Fonte | Agibank Sans — Light e Bold |

## CENA 02 — Agir como empreendedor
| Campo | Valor |
|---|---|
| Timecode | 00:29.320 – 00:36.953 |
| Sincronismo | Silêncio |
| Texto | "Aqui, você age como dono porque já é ou porque sonha em ser o próximo." |
| Fundo | Cinza claro `#F3F3F3` |
| Cor da fonte | Azul Agibank |
| Fonte | Agibank Sans — Light e Bold |
| Formas | Cacos canto inferior, verde `#77df40` |
| Logo | "Jeito Agi \| Agir como empreendedor", topo |

## CENA 03 — Crescer na jornada
| Campo | Valor |
|---|---|
| Timecode | 01:01.686 – 01:11.362 |
| Sincronismo | Silêncio |
| Texto | "Crescer na jornada." (linha 1, peso Regular/Light) / "E na vida." (linha 2, maior e em **Bold**, round 2026-11-19) — centralizado |
| Fundo | Cinza claro `#F3F3F3` |
| Cor da fonte | Azul Agibank |
| Fonte | Agibank Sans — Light e Bold |
| Formas | Cacos canto inferior, ambos amarelo `#ffd600` (round 2026-11-19) — exceção de marca aprovada em 2026-11-19 (amarelo sobre cinza claro) continua válida porque texto e logo da cena são azul Agibank |
| Logo | Lockup oficial "O jeito agi \| Crescer na jornada" (`crescer_na_jornada_positivo.svg`), topo, 84px |

## CENA 04 — Viver pelo cliente
| Campo | Valor |
|---|---|
| Timecode | 01:36.429 – 01:44.437 |
| Sincronismo | Silêncio |
| Texto | 3 blocos centralizados (round 2026-11-19): "Vivendo pelo cliente," / "acolhemos e encorajamos" / "milhares de brasileiros." |
| Fundo | Cinza claro `#F3F3F3` |
| Cor da fonte | Azul Agibank |
| Fonte | Agibank Sans — Light e Bold |
| Formas | Cacos canto inferior, azul médio `#0033b0` |
| Logo | Lockup oficial "O jeito agi \| Viver pelo cliente" (`viver_pelo_cliente_positivo.svg`), topo, 84px |

## CENA 05 — Fechamento de chamada
| Campo | Valor |
|---|---|
| Timecode | 02:12.000 – 02:17.000 (fixo, sem sync com voz) |
| Sincronismo | Timecode fixo — motion entra e sai dentro da janela, independente da fala |
| Texto | "Sua jornada tem O Jeito Agi?" (Light) \| "A próxima história pode ser a sua." (Bold), centralizado, abaixo do logo |
| Fundo | Azul Agibank |
| Logo | Minuto Jeito Agi — **centralizado no meio da tela (não mais no topo), maior** (round 2026-11-19) |
| Layout | Composição vertical única centralizada: logo em cima, texto abaixo, o bloco inteiro centralizado no quadro (não cada elemento isolado) |
| Fonte | Agibank Sans — Light e Bold |
| Observação | Continuidade direta com o Encerramento — mesma base azul, transição interna entre os dois |

## ENCERRAMENTO
| Campo | Valor |
|---|---|
| Timecode | 02:18.100 – 02:21.933 |
| Sincronismo | Silêncio total |
| Transição | Da tela da Cena 05 para o logo Agibank — anima só o logo, fundo azul Agibank permanece |
| Elemento | Logo Agibank — assinatura final |
| Posição | Centralizado, tamanho pequeno/moderado (exceção de marca aprovada em 2026-11-19 — regra geral manda canto inferior direito) |
| Animação | Animação própria de logo (entrada), a definir na implementação |

---

## Dados técnicos de apoio (ver `analise/`)
Frames pretos: 0–8.3s / 29.3–37.0s / 61.7–71.4s / 96.4–104.4s
Silêncio final (Encerramento): 138.1s–141.9s (3.83s)
Transcrição por palavra: manual, whisperx bloqueado por política corporativa (Hugging Face)