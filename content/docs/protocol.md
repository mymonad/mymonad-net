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
1. Both parties send encrypted vectors to TEE relay
2. TEE computes cosine similarity
3. TEE returns boolean: similarity >= t (threshold)
4. If false, handshake terminates

**Privacy:**
- Raw vectors never exposed to peer
- Only binary match/no-match result revealed
- Threshold t configurable (default: 0.85)

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
1. End-to-end encrypted messaging
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
| `AttestationRequest` | 1 | I->R |
| `AttestationResponse` | 1 | R->I |
| `VectorMatchRequest` | 2 | Both |
| `VectorMatchResult` | 2 | TEE->Both |
| `DealBreakerQuestions` | 3 | Both |
| `DealBreakerAnswers` | 3 | Both |
| `ChatMessage` | 4 | Both |
| `UnmaskRequest` | 5 | Both |
| `IdentityReveal` | 5 | Both |
