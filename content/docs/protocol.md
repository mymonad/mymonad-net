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

**Anti-spam:**
- Configurable difficulty (default: 16 bits)
- Prevents mass connection attempts
- No personal data exchanged

## Stage 2: Vector Match

**Purpose:** Confirm actual similarity exceeds threshold.

**Protocol:**
1. Both parties exchange serialized Monad vectors
2. Each computes cosine similarity locally
3. If similarity < threshold, handshake terminates
4. Only boolean result (match/no-match) determines progression

**Privacy:**
- Vectors exchanged only after attestation passes
- Threshold t configurable (default: 0.85)
- Failed matches reveal nothing about why

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

**Purpose:** Optional direct conversation before unmasking.

**Protocol:**
1. End-to-end encrypted messaging via X25519 key exchange
2. No identity revealed
3. Either party can proceed to unmask or terminate

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

Default difficulty: 16 bits (adjustable via config)

### Vector Exchange

Vectors are serialized as little-endian float32 arrays and transmitted after attestation. Each party computes cosine similarity independently.

### Key Exchange (Stage 4+)

X25519 ephemeral keys generated per handshake. Shared secret derived via Diffie-Hellman, then used with AES-256-GCM for message encryption.
