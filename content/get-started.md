---
title: "Get Started"
description: "Install and run MyMonad - privacy-preserving compatibility matching in minutes"
---

## Prerequisites

Before installing MyMonad, ensure you have:

- **Rust 1.75+** — [Install Rust](https://rustup.rs/)
- **OpenSSL 3.x** — Required for cryptographic operations
- **4GB RAM minimum** — Embedding generation requires memory
- **Linux/macOS** — Windows support via WSL2

---

## Quick Start

Get your monad running in 5 steps:

### Step 1: Clone the Repository

```bash
git clone https://github.com/mymonad/mymonad.git
cd mymonad
```

### Step 2: Build the Project

```bash
cargo build --release
```

### Step 3: Initialize Your Monad

```bash
./target/release/mymonad init
```

This creates your cryptographic identity and configuration files in `~/.mymonad/`.

### Step 4: Configure Your Profile

Edit `~/.mymonad/ingest.toml` with your data sources (see Configuration below).

### Step 5: Start the Agent

```bash
./target/release/mymonad agent start
```

Your monad is now live on the network.

---

## Configuration

### ingest.toml

Controls how your data is transformed into embeddings:

```toml
[sources]
# Text-based profile data
profile_text = "~/.mymonad/profile.txt"

# Structured preferences
preferences = "~/.mymonad/preferences.json"

[embedding]
# Model for text embedding
model = "local-minilm"

# Embedding dimensions
dimensions = 384

[privacy]
# Differential privacy noise level
epsilon = 1.0

# Minimum k-anonymity
k_anonymity = 5
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

# Proof verification strictness
strict_verification = true
```

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `mymonad init` | Initialize a new monad identity |
| `mymonad agent start` | Start the agent daemon |
| `mymonad agent stop` | Stop the agent daemon |
| `mymonad agent status` | Check agent status and connections |
| `mymonad ingest` | Re-process data sources into embeddings |
| `mymonad matches` | List successful handshakes |
| `mymonad channels` | Manage secure communication channels |
| `mymonad keys export` | Export your cryptographic keys |
| `mymonad keys import` | Import keys from backup |

---

## Next Steps

Your monad is running. Now what?

- **[How It Works](/how-it-works/)** — Understand the protocol deeply
- **[Use Cases](/use-cases/)** — See what others are building
- **[The Manifesto](/manifesto/)** — Understand the philosophy

---

## Troubleshooting

**Agent won't start?**
- Check if port 4001 is available: `lsof -i :4001`
- Verify OpenSSL version: `openssl version`

**No matches appearing?**
- Confirm your embedding was generated: `mymonad agent status`
- Check threshold isn't too high in `agent.toml`

**Handshakes timing out?**
- Increase `stage_timeout` in `agent.toml`
- Verify network connectivity to bootstrap nodes

For more help, open an issue on GitHub.
