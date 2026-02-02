#!/bin/bash
set -e

# Build site first
hugo --gc --minify

# Check if htmltest is available
if ! command -v htmltest &> /dev/null; then
    echo "htmltest not found. Install from: https://github.com/wjdp/htmltest"
    exit 1
fi

# Check links
echo "Checking links..."
htmltest public/

echo "Link check passed!"
