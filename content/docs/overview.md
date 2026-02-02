---
title: "Overview"
description: "Architecture overview of MyMonad - components, data flow, and design principles"
weight: 1
---

MyMonad consists of three main components that work together to provide privacy-preserving compatibility matching.

## Components

### mymonad-ingest

The data ingestion daemon. Watches local directories for document changes and builds your Monad vector.

**Responsibilities:**
- File system watching (fsnotify)
- Content extraction from supported formats
- Embedding generation via Ollama
- Running average vector updates
- Encrypted Monad storage

### mymonad-agent

The P2P networking daemon. Handles peer discovery, connections, and the handshake protocol.

**Responsibilities:**
- libp2p host management
- Kademlia DHT participation
- mDNS local discovery
- Handshake protocol state machine
- Peer reputation tracking

### mymonad-cli

Command-line interface for interacting with the daemons.

**Responsibilities:**
- Status queries
- Peer management
- Identity display
- Manual bootstrapping

## Data Flow

```
Documents → Ingest → Embeddings → Monad Vector
                                      ↓
                            Agent (P2P Network)
                                      ↓
                              Peer Discovery
                                      ↓
                            5-Stage Handshake
                                      ↓
                           Compatible Match
```

## Design Principles

1. **Privacy First** - Raw data never leaves your device
2. **Decentralized** - No central servers or authorities
3. **Progressive Trust** - Reveal information only as trust is established
4. **Cryptographic Verification** - Math replaces blind trust
5. **User Sovereignty** - You own your keys, your data, your connections

## Key Packages

| Package | Description |
|---------|-------------|
| `pkg/monad` | Affinity vector with running average updates |
| `pkg/protocol` | 5-stage handshake FSM |
| `pkg/lsh` | Locality Sensitive Hashing for discovery |
| `pkg/hashcash` | Proof-of-work anti-spam |
| `internal/crypto` | Ed25519, X25519, encrypted storage |
| `internal/agent` | libp2p networking |
