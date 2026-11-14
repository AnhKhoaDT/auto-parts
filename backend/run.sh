#!/usr/bin/env bash
set -e

echo "Starting AutoParts Core API on port 8080..."
/home/kai/Personal/auto-parts/auto-parts/.tools/bin/go run ./cmd/api

