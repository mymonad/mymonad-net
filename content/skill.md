---
title: "MyMonad Agent Guide"
description: "Machine-readable guide for AI agents to help users with MyMonad"
---

```yaml
name: mymonad
version: 0.1.0
description: Privacy-preserving P2P compatibility protocol
homepage: https://mymonad.net
repository: https://github.com/mymonad/mymonad
documentation: https://mymonad.net/docs/
```

## What is MyMonad

MyMonad is a decentralized P2P protocol for privacy-preserving compatibility matching. Users' preferences are represented as high-dimensional embedding vectors ("Monads") that never leave their devices. Agents negotiate compatibility through cryptographic proofs.

**Key concepts:**
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

## Installation

```bash
# Clone repository
git clone https://github.com/mymonad/mymonad
cd mymonad

# Build all binaries
make build
```

## Running MyMonad

**Terminal 1 - Start ingest daemon:**
```bash
./bin/mymonad-ingest --watch-dirs ~/Documents
```

**Terminal 2 - Start agent daemon:**
```bash
./bin/mymonad-agent
```

**Check status:**
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

## Configuration

Location: `~/.config/mymonad/`

**ingest.toml:**
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

**agent.toml:**
```toml
[network]
port = 4001

[discovery]
mdns_enabled = true
bootstrap = []

[protocol]
similarity_threshold = 0.85
challenge_difficulty = 16

[storage]
identity_path = "~/.local/share/mymonad/identity.key"
peers_cache = "~/.local/share/mymonad/peers.json"
```

## Troubleshooting

**"connection refused" from Ollama:**
```bash
ollama serve        # Start server
ollama list         # Verify model exists
```

**"permission denied" on sockets:**
```bash
rm ~/.local/share/mymonad/agent.sock
rm ~/.local/share/mymonad/ingest.sock
```

**"address already in use":**
```bash
lsof -i :4001                    # Find process
./bin/mymonad-agent --port 4002  # Use different port
```

**mDNS not discovering peers (Linux):**
```bash
sudo systemctl start avahi-daemon
sudo ufw allow 5353/udp
```

**Identity file corrupted:**
```bash
rm ~/.local/share/mymonad/identity.key
./bin/mymonad-agent  # Regenerates identity
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

## Architecture

```
mymonad-ingest: Watches files → generates embeddings → updates Monad vector
mymonad-agent:  P2P networking → peer discovery → handshake protocol
mymonad-cli:    User interface to daemons via IPC
```

## Links

- Documentation: https://mymonad.net/docs/
- GitHub: https://github.com/mymonad/mymonad
- Issues: https://github.com/mymonad/mymonad/issues
