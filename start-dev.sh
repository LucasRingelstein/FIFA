#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$ROOT_DIR/LeagueManager.Api"
WEB_DIR="$ROOT_DIR/League-manager-web"

echo "== League Manager: Dev Launcher =="

if [ ! -d "$API_DIR" ]; then
  echo "No se encontró carpeta backend: $API_DIR" >&2
  exit 1
fi

echo "Iniciando backend (.NET API)..."
(
  cd "$API_DIR"
  dotnet restore
  dotnet run
) &
BACK_PID=$!

if [ -d "$WEB_DIR" ] && [ -f "$WEB_DIR/package.json" ]; then
  echo "Frontend detectado. Iniciando Vite..."
  (
    cd "$WEB_DIR"
    npm install
    npm run dev
  ) &
  WEB_PID=$!
  echo "Backend PID: $BACK_PID"
  echo "Frontend PID: $WEB_PID"
  wait "$BACK_PID" "$WEB_PID"
else
  echo "Frontend no encontrado. Solo backend iniciado."
  echo "Backend PID: $BACK_PID"
  wait "$BACK_PID"
fi
