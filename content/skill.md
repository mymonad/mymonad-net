---
title: "MyMonad Agent Guide"
description: "Machine-readable guide for AI agents to help users with MyMonad"
layout: "skill"
outputs:
  - html
---
name: mymonad
version: 0.1.0
description: Privacy-preserving P2P compatibility protocol
homepage: https://mymonad.net
repository: https://github.com/mymonad/mymonad
documentation: https://mymonad.net/docs/

# MyMonad Agent Guide

This document helps AI agents assist users with MyMonad installation, configuration, and troubleshooting.

## What is MyMonad

MyMonad is a decentralized P2P protocol for privacy-preserving compatibility matching. Users' preferences are represented as high-dimensional embedding vectors ("Monads") that never leave their devices. Agents negotiate compatibility through cryptographic proofs.

Key concepts:
- **Monad**: A 768-dimensional vector representing user preferences, computed locally
- **LSH (Locality Sensitive Hashing)**: Privacy-preserving similarity search
- **5-stage Handshake**: Progressive trust establishment between peers
- **libp2p**: Decentralized networking layer

## Prerequisites

Before installing MyMonad, users need:

1. **Go 1.21+**
   - Check: `go version`
   - Install: https://golang.org/dl/

2. **Ollama** (local LLM inference)
   - Check: `ollama --version`
   - Install: https://ollama.ai
   - Required model: `ollama pull nomic-embed-text`

3. **Make** (optional, for convenience)

## Installation Steps

```bash
# Clone repository
git clone https://github.com/mymonad/mymonad
cd mymonad

# Build all binaries
make build
# Or: go build -o bin/mymonad-agent ./cmd/mymonad-agent && \
#     go build -o bin/mymonad-cli ./cmd/mymonad-cli && \
#     go build -o bin/mymonad-ingest ./cmd/mymonad-ingest
```

## Running MyMonad

### Start ingest daemon (Terminal 1)
```bash
./bin/mymonad-ingest --watch-dirs ~/Documents
```

### Start agent daemon (Terminal 2)
```bash
./bin/mymonad-agent
```

### Check status
```bash
./bin/mymonad-cli status
```

## Common Commands

| Command | Description |
|---------|-------------|
| `./bin/mymonad-cli status` | Show daemon status |
| `./bin/mymonad-cli peers` | List connected peers |
| `./bin/mymonad-cli identity` | Show local Peer ID and DID |
| `./bin/mymonad-cli bootstrap <multiaddr>` | Connect to specific peer |

## Configuration Files

Location: `~/.config/mymonad/`

### ingest.toml
```toml
[watch]
directories = ["~/Documents", "~/Notes"]
extensions = [".txt", ".md"]

[ollama]
url = "http://localhost:11434"
model = "nomic-embed-text"
```

### agent.toml
```toml
[network]
port = 4001

[discovery]
mdns_enabled = true

[protocol]
similarity_threshold = 0.85
challenge_difficulty = 16
```

## Troubleshooting

### "connection refused" from Ollama
```bash
# Start Ollama server
ollama serve

# Verify model exists
ollama list
# Should show: nomic-embed-text
```

### "permission denied" on sockets
```bash
# Remove stale socket files
rm ~/.local/share/mymonad/agent.sock
rm ~/.local/share/mymonad/ingest.sock
```

### "address already in use" for agent
```bash
# Find process using port
lsof -i :4001

# Use different port
./bin/mymonad-agent --port 4002
```

### mDNS not discovering peers
```bash
# Linux: ensure Avahi is running
systemctl status avahi-daemon
sudo systemctl start avahi-daemon

# Allow mDNS through firewall
sudo ufw allow 5353/udp
```

### Identity file corrupted
```bash
# Remove and regenerate (creates new identity)
rm ~/.local/share/mymonad/identity.key
./bin/mymonad-agent
```

## Data Paths

| Path | Purpose |
|------|---------|
| `~/.config/mymonad/` | Configuration |
| `~/.local/share/mymonad/` | Data |
| `~/.local/share/mymonad/identity.key` | Encrypted Ed25519 key |
| `~/.local/share/mymonad/monad.bin` | Monad vector |
| `~/.local/share/mymonad/agent.sock` | Agent IPC socket |
| `~/.local/share/mymonad/ingest.sock` | Ingest IPC socket |

## Architecture Summary

```
mymonad-ingest: Watches files -> generates embeddings -> updates Monad vector
mymonad-agent: P2P networking -> peer discovery -> handshake protocol
mymonad-cli: User interface to daemons via IPC
```

## Getting Help

- Documentation: https://mymonad.net/docs/
- GitHub Issues: https://github.com/mymonad/mymonad/issues
- Protocol spec: https://mymonad.net/docs/protocol/
