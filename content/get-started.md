---
title: "Get Started"
description: "Install and run MyMonad - privacy-preserving compatibility matching in minutes"
---

## Prerequisites

Before installing MyMonad, ensure you have:

- **Go 1.21+** — [Download Go](https://golang.org/dl/)
- **Ollama** — [Install Ollama](https://ollama.ai) for local embedding generation
- **Make** (optional) — For convenience build commands
- **4GB RAM minimum** — Embedding generation requires memory

---

## Quick Start

Get your monad running in 5 steps:

### Step 1: Install Ollama and Pull Model

```bash
# Install Ollama (see https://ollama.ai for your platform)
# Then pull the embedding model
ollama pull nomic-embed-text
```

### Step 2: Clone and Build

```bash
git clone https://github.com/mymonad/mymonad.git
cd mymonad
make build
```

This creates three binaries in `./bin/`:
- `mymonad-ingest` — Data processing daemon
- `mymonad-agent` — P2P network daemon
- `mymonad-cli` — Command-line interface

### Step 3: Start the Ingest Daemon

```bash
# Watch directories for documents to process
./bin/mymonad-ingest --watch-dirs ~/Documents
```

This daemon watches for file changes and generates your Monad embedding vector locally.

### Step 4: Start the Agent Daemon

In another terminal:

```bash
./bin/mymonad-agent
```

Your agent is now live on the P2P network, discovering compatible peers.

### Step 5: Check Status

```bash
./bin/mymonad-cli status
```

---

## Configuration

Configuration files are stored in `~/.config/mymonad/`.

### ingest.toml

Controls how your data is transformed into embeddings:

```toml
[sources]
# Directories to watch for documents
watch_dirs = ["~/Documents", "~/Notes"]

[embedding]
# Ollama model for embeddings
model = "nomic-embed-text"

# Embedding dimensions (768 for nomic-embed-text)
dimensions = 768

[privacy]
# Differential privacy noise level
epsilon = 1.0
```

### agent.toml

Controls network behavior and matching parameters:

```toml
[network]
# Bootstrap nodes for mesh discovery
bootstrap = [
    "/dns4/node1.mymonad.net/tcp/4001",
    "/dns4/node2.mymonad.net/tcp/4001"
]

# Listen address
listen = "/ip4/0.0.0.0/tcp/4001"

[matching]
# Minimum cosine similarity to trigger handshake
threshold = 0.75

# Maximum concurrent handshakes
max_handshakes = 10

[handshake]
# Timeout for each handshake stage (seconds)
stage_timeout = 30
```

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `mymonad-cli status` | Check agent status and connections |
| `mymonad-cli matches` | List successful handshakes |
| `mymonad-cli channels` | Manage secure communication channels |
| `mymonad-cli keys export` | Export your cryptographic keys |
| `mymonad-cli keys import` | Import keys from backup |

---

## Directory Structure

After running, MyMonad creates:

| Path | Description |
|------|-------------|
| `~/.config/mymonad/` | Configuration files |
| `~/.local/share/mymonad/` | Data directory |
| `~/.local/share/mymonad/identity.key` | Encrypted identity |
| `~/.local/share/mymonad/monad.bin` | Your Monad vector |

---

## Next Steps

Your monad is running. Now what?

- **[How It Works](/how-it-works/)** — Understand the protocol deeply
- **[Use Cases](/use-cases/)** — See what others are building
- **[The Manifesto](/manifesto/)** — Understand the philosophy

---

## Troubleshooting

**Ollama connection refused?**
```bash
# Ensure Ollama is running
ollama serve

# Verify model is available
ollama list
```

**Agent won't start?**
- Check if port 4001 is available: `lsof -i :4001`
- Remove stale sockets: `rm ~/.local/share/mymonad/*.sock`

**No matches appearing?**
- Confirm your embedding was generated: `mymonad-cli status`
- Check threshold isn't too high in `agent.toml`

For more help, [open an issue on GitHub](https://github.com/mymonad/mymonad/issues).
