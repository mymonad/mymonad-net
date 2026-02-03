---
title: "Overview"
description: "Architecture overview of MyMonad - components, data flow, and design principles"
weight: 1
---

MyMonad is a **protocol** for privacy-preserving similarity-based discovery, with a **reference implementation** for human matchmaking. This page covers the architecture of both.

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
- LSH-based peer discovery (commit-reveal)
- Handshake protocol state machine
- Adaptive anti-spam difficulty
- ZK proof exchange (optional)
- Encrypted chat messaging

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
                               LSH Signatures
                                      ↓
                            Agent (P2P Network)
                                      ↓
                           Discovery (DHT + mDNS)
                                      ↓
                            5-Stage Handshake
                                      ↓
                            Compatible Match
```

## Design Principles

1. **Privacy First** — Raw data never leaves your device
2. **Decentralized** — No central servers or authorities
3. **Progressive Trust** — Reveal information only as trust is established
4. **Cryptographic Verification** — Math replaces blind trust
5. **User Sovereignty** — You own your keys, your data, your connections

## Protocol vs Application

| Aspect | Protocol | Application |
|--------|----------|-------------|
| **Purpose** | Generic similarity-based discovery | Human matchmaking |
| **Scope** | Infrastructure primitives | User-facing workflow |
| **Customization** | Domain-agnostic | Dating/social/professional |
| **Examples** | LSH, handshake, ZK proofs | Deal-breakers, chat, unmask |

## Key Packages

| Package | Description |
|---------|-------------|
| `pkg/monad` | Affinity vector with running average updates |
| `pkg/protocol` | 5-stage handshake FSM |
| `pkg/lsh` | Locality Sensitive Hashing for discovery |
| `pkg/hashcash` | Proof-of-work anti-spam |
| `pkg/zkproof` | Zero-knowledge circuits (gnark/PlonK, BN254) |
| `internal/antispam` | Load-adaptive difficulty controller (16→28 bits) |
| `internal/chat` | Encrypted messaging with HKDF key derivation |
| `internal/discovery` | LSH-based peer discovery with commit-reveal |
| `internal/zkproof` | ZK proof exchange protocol |
| `internal/crypto` | Ed25519, X25519, encrypted storage |
| `internal/agent` | libp2p networking |
