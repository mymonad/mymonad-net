---
title: "Protocol Specification"
description: "Detailed specification of the MyMonad 5-stage handshake protocol"
weight: 2
---

The MyMonad handshake protocol establishes trust between two agents progressively, revealing information only as confidence grows.

## Overview

Two agents that discover potential compatibility (via LSH bucket matching) initiate a handshake. The handshake has 5 stages, each with specific requirements.

## Stage 1: Attestation

**Purpose:** Verify the peer is a legitimate MyMonad agent, not a spam bot.

**Protocol:**
1. Initiator sends `AttestationRequest` with nonce
2. Responder computes Hashcash proof-of-work on nonce
3. Responder sends `AttestationResponse` with proof
4. Initiator verifies proof meets difficulty threshold

**Adaptive Anti-Spam:**
- Load-adaptive difficulty tiers: 16 → 20 → 24 → 28 bits
- Difficulty scales based on incoming request rate per sliding window
- Automatic de-escalation after cooldown period
- Prevents mass connection attempts while remaining accessible under normal load

**Thresholds (configurable):**
- Base: 16 bits
- Elevated: 20 bits (>10 requests/window)
- High: 24 bits (>50 requests/window)
- Critical: 28 bits (>100 requests/window)

## Stage 2: Vector Match

**Purpose:** Confirm actual similarity exceeds threshold.

**Protocol:**
1. Both parties exchange serialized Monad vectors
2. Each computes cosine similarity locally
3. If similarity < threshold, handshake terminates
4. Only boolean result (match/no-match) determines progression

**Privacy:**
- Vectors exchanged only after attestation passes
- Threshold τ configurable (default: 0.85)
- Failed matches reveal nothing about why

**Optional ZK Enhancement:**
- Zero-knowledge proofs can verify LSH signature proximity without revealing actual signatures
- Uses gnark/PlonK circuits with BN254 curve
- Verifies Hamming distance ≤ max_distance (default: 64)
- Configurable via `[zkproof]` section

## Stage 3: Deal Breakers

**Purpose:** Exchange yes/no compatibility questions.

**Protocol:**
1. Both parties exchange encrypted question sets
2. Decrypt and evaluate locally
3. Send encrypted answers
4. Compare answers for compatibility

**Examples:**
- "Do you smoke?"
- "Do you want children?"
- "Are you religious?"

## Stage 4: Human Chat

**Purpose:** Direct conversation before unmasking.

**Protocol:**
1. Derive shared secret via X25519 Diffie-Hellman
2. Use HKDF to derive AES-256-GCM encryption key
3. End-to-end encrypted messaging
4. Zero-persistence: messages not stored after handshake
5. Either party can proceed to unmask or terminate

**Security:**
- Each message has unique nonce
- Authentication tag prevents tampering
- Conversation data purged on handshake completion

## Stage 5: Unmask

**Purpose:** Mutual consent to reveal identities.

**Protocol:**
1. Both parties send `UnmaskRequest`
2. On receiving both requests, exchange identity info
3. Connection established

**Requirements:**
- Both parties must consent
- Unilateral unmask not possible

## State Machine

```
IDLE → ATTESTATION_SENT → ATTESTATION_VERIFIED
                              ↓
                        VECTOR_MATCH_SENT → VECTOR_MATCHED
                                                ↓
                                    DEAL_BREAKERS_SENT → DEAL_BREAKERS_PASSED
                                                              ↓
                                                    CHAT_ACTIVE (optional)
                                                              ↓
                                                    UNMASK_REQUESTED → UNMASKED
```

Any stage can transition to `FAILED` if requirements not met.

## Message Types

| Message | Stage | Direction |
|---------|-------|-----------|
| `AttestationRequest` | 1 | I→R |
| `AttestationResponse` | 1 | R→I |
| `VectorMatchRequest` | 2 | Both |
| `VectorMatchResult` | 2 | Both |
| `DealBreakerQuestions` | 3 | Both |
| `DealBreakerAnswers` | 3 | Both |
| `ChatMessage` | 4 | Both |
| `UnmaskRequest` | 5 | Both |
| `IdentityReveal` | 5 | Both |

## Cryptographic Details

### Attestation (Hashcash)

```
challenge = SHA256(nonce || peer_id || timestamp)
proof = find_nonce where SHA256(challenge || proof) has N leading zeros
```

Difficulty N determined by adaptive anti-spam controller.

### Vector Exchange

Vectors are serialized as little-endian float32 arrays and transmitted after attestation. Each party computes cosine similarity independently.

### Key Exchange (Stage 4+)

X25519 ephemeral keys generated per handshake. Shared secret derived via Diffie-Hellman, then HKDF produces encryption key for AES-256-GCM.

### Zero-Knowledge Proofs (Optional)

When enabled, peers can prove their LSH signatures are within a certain Hamming distance without revealing the signatures:

```
Circuit: HammingDistanceCircuit
- Public inputs: claimed distance, threshold
- Private inputs: signature A, signature B
- Constraint: HammingDistance(A, B) ≤ threshold
```

Uses gnark library with PlonK proving system and BN254 elliptic curve.

## Configuration

### Anti-Spam (`[antispam]`)

```toml
[antispam]
window_duration = "1m"
cooldown_duration = "5m"
elevated_rate_threshold = 10
high_rate_threshold = 50
critical_rate_threshold = 100
```

### ZK Proofs (`[zkproof]`)

```toml
[zkproof]
enabled = false
require_zk = false
prefer_zk = true
max_distance = 64
proof_timeout = "30s"
```
