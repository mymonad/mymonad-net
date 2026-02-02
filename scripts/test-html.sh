#!/bin/bash
set -e

# Build site first
hugo --gc --minify

# Check if html5validator is available
if ! command -v html5validator &> /dev/null; then
    echo "html5validator not found. Install with: pip install html5validator"
    exit 1
fi

# Validate all HTML files
echo "Validating HTML..."
html5validator --root public/ --also-check-css --log INFO

echo "HTML validation passed!"
