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

## Global Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--config` | Config file path | `~/.config/mymonad/cli.toml` |
| `--socket` | Agent socket path | `~/.local/share/mymonad/agent.sock` |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Connection failed |
| 3 | Invalid arguments |
