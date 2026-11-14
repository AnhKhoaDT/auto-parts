#!/usr/bin/env bash
set -e

# Load environment variables without printing secrets
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "Running migrations with Goose..."
/home/kai/Personal/auto-parts/auto-parts/.tools/bin/goose -dir db/migrations postgres "$DATABASE_URL" up
