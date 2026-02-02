---
title: "CLI Reference"
description: "Complete reference for mymonad-cli commands"
weight: 4
---

The `mymonad-cli` tool provides command-line access to the MyMonad daemons.

## Commands

### status

Show status of agent and ingest daemons.

```bash
./bin/mymonad-cli status
```

**Output:**
- Agent daemon: running/stopped, peer count
- Ingest daemon: running/stopped, documents indexed
- Monad: vector dimensions, last updated

### peers

List all connected peers.

```bash
./bin/mymonad-cli peers
```

**Output:**
- Peer ID
- Multiaddresses
- Connection state
- Latency

### identity

Display local identity information.

```bash
./bin/mymonad-cli identity
```

**Output:**
- Peer ID (libp2p identifier)
- DID (Decentralized Identifier)
- Listen addresses

### bootstrap

Manually connect to a peer.

```bash
./bin/mymonad-cli bootstrap /ip4/192.168.1.100/tcp/4001/p2p/12D3KooWAbCdEf...
```

**Arguments:**
- `multiaddr` - libp2p multiaddress of peer to connect

## Daemon Commands

### mymonad-ingest

The ingest daemon watches directories for document changes.

```bash
# Basic usage
./bin/mymonad-ingest --watch-dirs ~/Documents

# Watch multiple directories
./bin/mymonad-ingest --watch-dirs ~/Documents,~/Notes,~/Projects

# Use config file
./bin/mymonad-ingest --config ~/.config/mymonad/ingest.toml

# Custom Ollama settings
./bin/mymonad-ingest --watch-dirs ~/Documents \
  --ollama-url http://localhost:11434 \
  --model nomic-embed-text

# Debug mode
./bin/mymonad-ingest --watch-dirs ~/Documents --log-level debug
```

**Supported file types:** `.txt`, `.md`

### mymonad-agent

The agent daemon runs the P2P network node.

```bash
# Basic usage (mDNS discovery)
./bin/mymonad-agent

# Specify port (default: 4001)
./bin/mymonad-agent --port 4001

# Connect to bootstrap peers
./bin/mymonad-agent --bootstrap /ip4/192.168.1.100/tcp/4001/p2p/12D3KooW...

# Disable mDNS
./bin/mymonad-agent --mdns=false

# Use config file
./bin/mymonad-agent --config ~/.config/mymonad/agent.toml

# Debug mode
./bin/mymonad-agent --log-level debug
```

## Global Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--config` | Config file path | `~/.config/mymonad/*.toml` |
| `--log-level` | Logging verbosity | `info` |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Connection failed |
| 3 | Invalid arguments |
