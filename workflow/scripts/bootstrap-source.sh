#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${1:-/tmp/fit-ai-buddy-src}"

if [ -d "$SOURCE_DIR/.git" ]; then
  echo "Source already cloned at $SOURCE_DIR"
else
  git clone --depth 1 --branch main \
    https://github.com/ROMAABI/fit-ai-buddy \
    "$SOURCE_DIR"
fi

echo
echo "Dart source files:"
find "$SOURCE_DIR/lib" -type f -name '*.dart' | sort

echo
echo "IMPORTANT: read every listed Dart file before coding."
