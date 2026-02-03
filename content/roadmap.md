---
title: "Roadmap"
description: "Where MyMonad is heading - current status and future plans"
---

## Current Status: v0.1

### Implemented

**Core Protocol:**
- 5-stage handshake protocol (Attestation → Vector Match → Deal Breakers → Human Chat → Unmask)
- Locality Sensitive Hashing (LSH) for privacy-preserving discovery
- Commit-reveal protocol for LSH signature exchange
- Adaptive anti-spam with tiered difficulty (16 → 20 → 24 → 28 bits)
- Zero-knowledge proofs for Hamming distance verification (gnark/PlonK, BN254)

**Cryptography:**
- Ed25519 identity and signing
- X25519 Diffie-Hellman key exchange
- AES-256-GCM authenticated encryption
- Argon2id key derivation
- Hashcash proof-of-work

**Services:**
- End-to-end encrypted chat with zero-persistence
- LSH-based peer discovery via DHT
- Load-adaptive difficulty controller

**Infrastructure:**
- libp2p networking with Kademlia DHT
- mDNS local discovery
- Local embedding via Ollama (nomic-embed-text)
- IPC between daemons
- Encrypted key storage

**Tooling:**
- mymonad-agent (P2P daemon)
- mymonad-cli (user interface)
- mymonad-ingest (data processing)
- Configuration system (TOML)
- Website and documentation

---

## Near Term

### v0.2 - Polish

- Mobile companion apps (iOS, Android)
- GUI application for desktop
- Additional embedding model support
- Performance optimizations
- Comprehensive test coverage

### v0.3 - Ecosystem

- Protocol specification document (RFC-style)
- Client libraries for other languages
- Plugin architecture for custom verticals
- Bootstrap node network

---

## Medium Term

### v0.4 - Scale

- DHT optimization for large networks
- Reputation system for peer quality
- Multi-monad profiles
- Cross-platform synchronization

### v0.5 - Enterprise

- Self-hosted deployment guide
- Compliance documentation
- Custom embedding model integration
- Audit logging (without match data exposure)

---

## Long Term

### v1.0 - Production

- Formal security audit
- Protocol stability guarantee
- Long-term support commitment
- Community governance model

### Beyond

- Decentralized identity standards integration (DID)
- Hardware security module support
- Advanced privacy features (differential privacy, MPC)
- Agent-to-agent protocol extensions

---

## Contributing

MyMonad is built in the open. We welcome contributions that align with our core principles:

- **Privacy first** — No telemetry, no tracking, no cloud dependencies
- **Local computation** — All AI processing happens on your hardware
- **Cryptographic trust** — Math, not reputation, determines compatibility
- **Individual sovereignty** — You own your data, your keys, your destiny

Visit our [GitHub repository](https://github.com/mymonad/mymonad) to get involved.
