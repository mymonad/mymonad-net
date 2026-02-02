---
title: "How It Works"
description: "Technical overview of the MyMonad protocol - from data ingestion to privacy-preserving matching"
---

## The Pipeline

MyMonad operates through three fundamental phases, each designed to preserve your privacy while enabling meaningful discovery.

### 1. Ingest

Your personal data never leaves your device in raw form. The ingest phase transforms your information into privacy-preserving embeddings:

- **Local Processing**: All data transformation happens on your hardware
- **Embedding Generation**: Text, preferences, and attributes become high-dimensional vectors
- **Zero Knowledge**: The original data cannot be reconstructed from embeddings

### 2. Discovery

Encrypted embeddings enter the network to find compatible monads:

- **Secure Broadcast**: Your encrypted profile propagates through the mesh
- **Cosine Similarity**: Mathematical compatibility scores computed on encrypted data
- **Threshold Matching**: Only scores above your defined threshold trigger the next phase

### 3. Handshake

When mutual compatibility is detected, the handshake protocol initiates:

- **Stage 1**: Exchange of commitment hashes
- **Stage 2**: Zero-knowledge proof of compatibility
- **Stage 3**: Mutual verification of proofs
- **Stage 4**: Key exchange for secure channel
- **Stage 5**: Channel establishment and metadata exchange

---

## Cryptographic Foundation

MyMonad's security rests on battle-tested cryptographic primitives:

| Component | Purpose |
|-----------|---------|
| **Homomorphic Encryption** | Compute on encrypted embeddings without decryption |
| **Zero-Knowledge Proofs** | Prove compatibility without revealing underlying data |
| **Commitment Schemes** | Bind to values before revelation |
| **Key Derivation** | Generate session keys from handshake material |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Your Device                          │
│  ┌─────────┐    ┌─────────────┐    ┌──────────────────┐    │
│  │  Data   │───▶│   Ingest    │───▶│  Encrypted       │    │
│  │ Sources │    │   Engine    │    │  Embeddings      │    │
│  └─────────┘    └─────────────┘    └────────┬─────────┘    │
│                                              │              │
│  ┌─────────────────────────────────────────▼─────────┐    │
│  │                    Agent                           │    │
│  │  ┌───────────┐  ┌────────────┐  ┌──────────────┐  │    │
│  │  │ Discovery │  │ Handshake  │  │   Channel    │  │    │
│  │  │  Module   │  │  Protocol  │  │   Manager    │  │    │
│  │  └───────────┘  └────────────┘  └──────────────┘  │    │
│  └───────────────────────┬───────────────────────────┘    │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │    P2P Mesh Network    │
              │  (Encrypted Traffic)   │
              └────────────────────────┘
```

---

## Why This Matters

Traditional matching systems require you to surrender your data to centralized servers. They see everything: your preferences, your interactions, your rejections. This data becomes a liability—breached, sold, or weaponized.

MyMonad inverts this model:

- **Your data stays local**: Servers never see raw information
- **Computation is distributed**: No single point of failure or surveillance
- **Math replaces trust**: Cryptographic proofs, not corporate promises
- **You control the keys**: Lose them and your monad is gone—true ownership

---

## Ready to Begin?

The protocol is open. The code is auditable. Your privacy is non-negotiable.

[Get Started →](/get-started/)
