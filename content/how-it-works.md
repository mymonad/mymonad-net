---
title: "How It Works"
description: "Technical overview of the MyMonad protocol - from discovery to trust establishment"
---

## The Protocol

MyMonad is a **decentralized protocol** for discovering peers with similar high-dimensional vectors while preserving privacy. The core primitive is the **Monad**: an embedding vector that represents some entity (a person, document, or concept) in mathematical form.

### What the Protocol Provides

- **Privacy-preserving discovery** — Peers find similar others using Locality Sensitive Hashing (LSH), which reveals only coarse similarity buckets, not raw vectors
- **Progressive trust establishment** — A multi-stage handshake where each stage must pass before proceeding, with zero data leakage on failure
- **Spam resistance** — Load-adaptive proof-of-work that scales difficulty based on network conditions
- **Optional ZK verification** — Zero-knowledge proofs can verify vector proximity without revealing the vectors themselves

No raw data leaves the local device. Only cryptographic proofs and hashed signatures are exchanged.

---

## Protocol Stack

| Layer | Components |
|-------|------------|
| **Discovery** | LSH signatures, DHT buckets, commit-reveal exchange |
| **Trust** | 5-stage handshake, progressive disclosure |
| **Security** | Ed25519 identity, X25519 key exchange, AES-256-GCM |
| **Anti-Spam** | Hashcash PoW, adaptive difficulty tiers (16→28 bits) |
| **Privacy** | Zero-knowledge proofs (gnark/PlonK), constant-time comparisons |
| **Transport** | libp2p streams, Kademlia DHT, mDNS |

---

## The Application: Human Matchmaking

The reference implementation uses this protocol for **autonomous matchmaking agents**. Each user's preferences, interests, and personality are encoded into a Monad vector via local LLM embeddings. Agents then:

1. **Discover** similar peers via LSH bucket queries on the DHT
2. **Handshake** through attestation, vector matching, and deal-breaker exchange
3. **Chat** via end-to-end encrypted messaging (zero-persistence)
4. **Unmask** with mutual consent to reveal identities

The agent runs entirely on the user's device. Your Monad never leaves your machine—only its hashed signature participates in discovery.

---

## The Pipeline

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
- **LSH Signatures**: Privacy-preserving similarity matching using commit-reveal
- **Threshold Matching**: Only peers above your similarity threshold trigger handshakes

### 3. Handshake

When potential compatibility is detected, the 5-stage handshake protocol initiates:

- **Stage 1: Attestation** — Hashcash proof-of-work with adaptive difficulty (anti-spam)
- **Stage 2: Vector Match** — Cosine similarity computed, boolean result only (match/no match)
- **Stage 3: Deal Breakers** — Exchange yes/no compatibility questions
- **Stage 4: Human Chat** — End-to-end encrypted conversation (AES-256-GCM, zero-persistence)
- **Stage 5: Unmask** — Mutual consent required to reveal identities

Each stage must pass before proceeding. Failure at any point terminates the handshake without data leakage.

---

## Cryptographic Foundation

| Component | Purpose |
|-----------|---------|
| **Ed25519** | Digital signatures and identity verification |
| **X25519** | Diffie-Hellman key exchange for secure channels |
| **Argon2id** | Key derivation from passwords |
| **AES-256-GCM** | Authenticated encryption for data at rest and chat |
| **Hashcash** | Proof-of-work for spam prevention |
| **gnark/PlonK** | Optional zero-knowledge proofs (BN254 curve) |

---

## Architecture

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

---

## Privacy Guarantees

- **Raw vectors never transmitted**: Only LSH signatures participate in discovery
- **LSH reveals only coarse similarity**: Bucket membership, not exact vectors
- **Optional ZK proofs**: Verify proximity without revealing signatures
- **Handshake can fail safely**: No data leakage on early termination
- **Zero persistence**: Chat data purged after handshake completion
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
