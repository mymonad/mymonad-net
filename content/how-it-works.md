---
title: "How It Works"
description: "Technical overview of the MyMonad protocol - from data ingestion to privacy-preserving matching"
---

## The Pipeline

MyMonad operates through three fundamental phases, each designed to preserve your privacy while enabling meaningful discovery.

### 1. Ingest

Your personal data never leaves your device in raw form. The ingest daemon transforms your information into privacy-preserving embeddings:

- **Local Processing**: All data transformation happens on your hardware using Ollama
- **Embedding Generation**: Text documents become 768-dimensional vectors via `nomic-embed-text`
- **Running Average**: Your Monad vector updates incrementally as you add documents
- **Encrypted Storage**: The final vector is stored locally in `~/.local/share/mymonad/monad.bin`

### 2. Discovery

Your agent joins the P2P network to find compatible peers:

- **Kademlia DHT**: Decentralized peer discovery via libp2p
- **mDNS**: Local network discovery for nearby peers
- **LSH Buckets**: Locality Sensitive Hashing enables O(log n) similarity search
- **Threshold Matching**: Only peers above your similarity threshold trigger handshakes

### 3. Handshake

When mutual compatibility is detected, the 5-stage handshake protocol initiates:

- **Stage 1: Attestation** - Hashcash proof-of-work verifies peer is legitimate (anti-spam)
- **Stage 2: Vector Match** - Cosine similarity computed, boolean result only (match/no match)
- **Stage 3: Deal Breakers** - Exchange yes/no compatibility questions
- **Stage 4: Human Chat** - Optional encrypted conversation before reveal
- **Stage 5: Unmask** - Mutual consent required to reveal identities

Each stage must pass before proceeding. Failure at any point terminates the handshake without data leakage.

---

## Cryptographic Foundation

MyMonad's security rests on battle-tested cryptographic primitives:

| Component | Purpose |
|-----------|---------|
| **Ed25519** | Digital signatures and identity verification |
| **X25519** | Diffie-Hellman key exchange for secure channels |
| **Argon2id** | Key derivation from passwords |
| **AES-256-GCM** | Authenticated encryption for data at rest |
| **Hashcash** | Proof-of-work for spam prevention |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Device                              │
│  ┌─────────┐    ┌─────────────┐    ┌──────────────────┐        │
│  │  Data   │───▶│  mymonad-   │───▶│  Monad Vector    │        │
│  │ Sources │    │  ingest     │    │  (768-dim)       │        │
│  └─────────┘    └─────────────┘    └────────┬─────────┘        │
│                                              │                  │
│  ┌───────────────────────────────────────────▼─────────────┐   │
│  │                   mymonad-agent                          │   │
│  │  ┌───────────┐  ┌────────────┐  ┌──────────────────┐    │   │
│  │  │ Discovery │  │ Handshake  │  │   Peer Manager   │    │   │
│  │  │  (DHT)    │  │    FSM     │  │                  │    │   │
│  │  └───────────┘  └────────────┘  └──────────────────┘    │   │
│  └───────────────────────┬─────────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │    P2P Mesh Network    │
              │  (libp2p / Kademlia)   │
              └────────────────────────┘
```

---

## Privacy Guarantees

- **Raw vectors never transmitted**: Only similarity scores cross the network
- **LSH reveals only coarse similarity**: Bucket membership, not exact vectors
- **Handshake can fail safely**: No data leakage on early termination
- **No central servers**: Pure P2P, no single point of surveillance

---

## Why This Matters

Traditional matching systems require you to surrender your data to centralized servers. They see everything: your preferences, your interactions, your rejections. This data becomes a liability—breached, sold, or weaponized.

MyMonad inverts this model:

- **Your data stays local**: Servers never see raw information
- **Computation is distributed**: No single point of failure
- **Math replaces trust**: Cryptographic verification, not corporate promises
- **You control the keys**: True ownership means true responsibility

---

## Ready to Begin?

The protocol is open. The code is auditable. Your privacy is non-negotiable.

[Get Started →](/get-started/)
