name: mymonad
version: 0.1.0
description: Privacy-preserving P2P protocol for similarity-based discovery
homepage: https://mymonad.net
repository: https://github.com/mymonad/mymonad
documentation: https://mymonad.net/docs/

# MyMonad Agent Guide

This document helps AI agents assist users with MyMonad installation, configuration, and troubleshooting.

## What is MyMonad

MyMonad is a decentralized P2P **protocol** for privacy-preserving similarity-based discovery. The core primitive is the **Monad**: a 768-dimensional vector that represents some entity (person, document, concept) in mathematical form.

### The Protocol

Generic infrastructure providing:
- **Privacy-preserving discovery** — LSH signatures, DHT buckets, commit-reveal
- **Progressive trust** — 5-stage handshake with zero leakage on failure
- **Spam resistance** — Adaptive proof-of-work (16→28 bits)
- **Optional ZK verification** — gnark/PlonK with BN254 curve

### The Application

Human matchmaking is the reference implementation. Users' preferences become Monad vectors via local LLM embeddings. Agents discover compatible peers, handshake, chat, and unmask with mutual consent.

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
ignore_hidden = true

[ollama]
url = "http://localhost:11434"
model = "nomic-embed-text"
timeout_seconds = 30

[storage]
monad_path = "~/.local/share/mymonad/monad.bin"
```

### agent.toml
```toml
[network]
port = 4001

[discovery]
mdns_enabled = true
bootstrap = []

[protocol]
similarity_threshold = 0.85

[antispam]
# Difficulty adapts automatically: 16→20→24→28 bits
window_duration = "1m"
cooldown_duration = "5m"
elevated_rate_threshold = 10
high_rate_threshold = 50
critical_rate_threshold = 100

[zkproof]
enabled = false           # Enable ZK proof exchanges
require_zk = false        # Require ZK from peers
prefer_zk = true          # Prefer ZK-capable peers
max_distance = 64         # Max Hamming distance for proof
proof_timeout = "30s"

[storage]
identity_path = "~/.local/share/mymonad/identity.key"
peers_cache = "~/.local/share/mymonad/peers.json"
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
┌─────────────────────────────────────────────────────────────────┐
│                         Applications                            │
├─────────────────────────────────────────────────────────────────┤
│  mymonad-agent     │  mymonad-cli      │  mymonad-ingest        │
│  (P2P daemon)      │  (user interface) │  (data processing)     │
├─────────────────────────────────────────────────────────────────┤
│                         Protocol Layer                          │
│  Handshake FSM  │  Attestation  │  Vector Match  │  Human Chat  │
├─────────────────────────────────────────────────────────────────┤
│                         Core Libraries                          │
│  Monad (vectors)  │  LSH (hashing)  │  Hashcash  │  ZK Proofs   │
├─────────────────────────────────────────────────────────────────┤
│                         Services                                │
│  Anti-Spam (adaptive PoW)  │  Chat (encrypted)  │  Discovery    │
├─────────────────────────────────────────────────────────────────┤
│                         Infrastructure                          │
│  Crypto (identity)  │  Agent (P2P)  │  IPC (local comms)       │
└─────────────────────────────────────────────────────────────────┘
```

## Getting Help

- Documentation: https://mymonad.net/docs/
- GitHub Issues: https://github.com/mymonad/mymonad/issues
- Protocol spec: https://mymonad.net/docs/protocol/
