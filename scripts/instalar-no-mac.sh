#!/usr/bin/env bash
# Instala o MSJ Motion Hub na pasta de trabalho do Mac SEM apagar nem sobrescrever nada
# que já exista nela, e gera a prévia da vinheta da Semana do Jeito Agi pelo terminal.
#
# Uso (no Terminal do Mac):
#   git clone --branch claude/nifty-wozniak-cs22q1 https://github.com/gbhrnds/msj-motion-hub.git /tmp/msj-clone
#   bash /tmp/msj-clone/scripts/instalar-no-mac.sh            # pasta padrão: ~/Desktop/editor-de-videos
#   bash /tmp/msj-clone/scripts/instalar-no-mac.sh ~/outra/pasta
set -euo pipefail

CLONE="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:-$HOME/Desktop/editor-de-videos}"
mkdir -p "$DEST"
DEST="$(cd "$DEST" && pwd)"

echo "Clone:   $CLONE"
echo "Destino: $DEST"
command -v node >/dev/null || { echo "ERRO: instale o Node.js 18+ (https://nodejs.org) e rode de novo."; exit 1; }
node -e 'process.exit(parseInt(process.versions.node)>=18?0:1)' || { echo "ERRO: Node.js 18 ou mais novo é necessário."; exit 1; }

# 1) Arquivos que existem nos dois lugares mas com conteúdo diferente: os SEUS ficam;
#    a versão do repositório é guardada ao lado, em _do-repositorio/, para comparar.
CONFLITOS="$DEST/_do-repositorio"
n=0
while IFS= read -r -d '' f; do
  rel="${f#$CLONE/}"
  if [ -f "$DEST/$rel" ] && ! cmp -s "$f" "$DEST/$rel"; then
    mkdir -p "$CONFLITOS/$(dirname "$rel")"
    cp "$f" "$CONFLITOS/$rel"
    echo "  mantido o seu: $rel  (versão do repositório em _do-repositorio/$rel)"
    n=$((n+1))
  fi
done < <(find "$CLONE" -type f -not -path "$CLONE/.git/*" -print0)
echo "$n arquivo(s) seus mantidos."

# 2) Copia só o que falta (nada existente é sobrescrito).
copiados=0
while IFS= read -r -d '' f; do
  rel="${f#$CLONE/}"
  if [ ! -e "$DEST/$rel" ]; then mkdir -p "$DEST/$(dirname "$rel")"; cp -p "$f" "$DEST/$rel"; copiados=$((copiados+1)); fi
done < <(find "$CLONE" -type f -not -path "$CLONE/.git/*" -print0)
echo "$copiados arquivo(s) novos copiados."

# 3) Liga a pasta ao Git (para puxar atualizações depois), se ela ainda não for um repositório.
if [ ! -d "$DEST/.git" ]; then
  cp -R "$CLONE/.git" "$DEST/.git"
  echo "Pasta ligada ao Git (branch claude/nifty-wozniak-cs22q1). Seus arquivos próprios aparecem em 'git status' e não são enviados sozinhos."
fi

# 4) Pasta do projeto da Semana (já vem do repositório) + pasta de saída dos renders.
mkdir -p "$DEST/projects/semana-jeito-agi/render"

# 5) Dependências e prévia (uma volta do loop, ~1min44s).
cd "$DEST"
npm install --no-audit --no-fund
SAIDA="projects/semana-jeito-agi/render/previa-uma-volta.mp4"
npx remotion render src/index.ts SJA-Previa-Uma-Volta "$SAIDA" --codec=h264 --crf=18 --pixel-format=yuv420p
echo ""
echo "Pronto: $DEST/$SAIDA"
echo "Para abrir o Studio (localhost:3000):  cd \"$DEST\" && npm run dev"
