---
title: "Installation"
description: "How to build and install MyMonad from source"
weight: 3
---

## Prerequisites

- **Go 1.21+** - [Download](https://golang.org/dl/)
- **Ollama** - [Install](https://ollama.ai)
- **Make** (optional)

## Build from Source

```bash
# Clone repository
git clone https://github.com/mymonad/mymonad
cd mymonad

# Build all binaries
make build

# Or build individually
go build -o bin/mymonad-agent ./cmd/mymonad-agent
go build -o bin/mymonad-cli ./cmd/mymonad-cli
go build -o bin/mymonad-ingest ./cmd/mymonad-ingest
```

## Install Embedding Model

```bash
ollama pull nomic-embed-text
```

## Verify Installation

```bash
# Start Ollama (if not running)
ollama serve

# Test ingest daemon
./bin/mymonad-ingest --help

# Test agent daemon
./bin/mymonad-agent --help

# Test CLI
./bin/mymonad-cli --help
```

## Directory Structure

After running, MyMonad creates:

| Path | Description |
|------|-------------|
| `~/.config/mymonad/` | Configuration files |
| `~/.local/share/mymonad/` | Data directory |
| `~/.local/share/mymonad/identity.key` | Encrypted identity |
| `~/.local/share/mymonad/monad.bin` | Your Monad vector |

## Troubleshooting

### Ollama connection refused

```bash
# Ensure Ollama is running
ollama serve

# Verify model is available
ollama list
```

### Permission denied on sockets

```bash
# Remove stale sockets
rm ~/.local/share/mymonad/*.sock
```

### Port already in use

```bash
# Use different port
./bin/mymonad-agent --port 4002
```
