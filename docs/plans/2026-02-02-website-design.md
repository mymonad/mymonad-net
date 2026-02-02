# MyMonad Website Design

## Overview

A hybrid marketing + documentation website for the MyMonad protocol - a general-purpose, privacy-preserving P2P compatibility matching infrastructure.

## Goals

1. **Explain the vision** - Position MyMonad as foundational infrastructure (like TCP/IP for privacy-preserving discovery)
2. **Onboard users** - Guide end users to try MeetMyMonad and other applications
3. **Serve developers** - Comprehensive documentation for building on the protocol
4. **Machine-readable** - Structured data and agent-friendly pages for AI bots to understand and explain MyMonad

## Target Audiences

| Audience | Needs | Funnel To |
|----------|-------|-----------|
| Privacy-conscious end users | Understand value, easy install | Get Started, MeetMyMonad |
| Developers/builders | Technical docs, API reference | Documentation, GitHub |
| Crypto/Web3 community | Philosophy, decentralization ethos | Manifesto |
| AI agents/bots | Structured data, parseable content | skill.md, JSON-LD |

## Tech Stack

- **Hugo** - Go-based static site generator (consistency with MyMonad codebase)
- **Vanilla CSS** - No framework, maximum control over output
- **Zero JS default** - Progressive enhancement only where needed
- **JSON-LD** - Structured data on every page

## Site Structure

```
content/
├── _index.md              # Home page
├── manifesto.md           # Philosophy ("The Manifesto of Closed Windows")
├── how-it-works.md        # Technical overview (5-stage handshake, vectors)
├── get-started.md         # User onboarding and installation
├── use-cases.md           # Applications gallery
├── roadmap.md             # Project direction
├── skill.md               # AI agent instruction page
├── blog/                  # Project updates and releases
│   └── _index.md
└── docs/                  # Developer documentation
    ├── _index.md          # Overview
    ├── protocol.md        # Protocol specification
    ├── installation.md    # Build and install guide
    ├── configuration.md   # Config options
    ├── cli.md             # CLI reference
    ├── api.md             # gRPC/IPC interface
    └── contributing.md    # Contribution guide
```

## Visual Design

### Typography

- **Headings:** Serif (Cormorant Garamond) - evokes Leibniz-era intellectual tradition
- **Body:** Sans-serif (Inter) - modern readability
- **Code:** Monospace (JetBrains Mono)

### Color Palette

```
Background:    #FAFAF8  (warm off-white)
Text:          #1A1A1A  (soft black)
Accent:        #5B4F3D  (muted bronze)
Secondary:     #8B7355  (lighter bronze)
Code blocks:   #F5F3EF  (subtle contrast)
Links:         #6B5B4F  (bronze)
```

### Principles

- Generous whitespace, classical proportions
- Typography-driven hierarchy
- Minimal, line-art illustrations if any
- Dark mode with warm inverted tones
- Mobile-first, content width ~70ch
- Sidebar navigation for docs (desktop)

## Home Page Structure

1. **Hero**
   - Headline: "Discover compatibility. Reveal nothing."
   - Subheadline: One sentence protocol explanation
   - CTAs: "Get Started" | "Read the Docs"

2. **Value Propositions (3 pillars)**
   - Your data stays yours
   - No central authority
   - Build anything

3. **How It Works (brief)**
   - 3-step visual: Ingest → Match → Connect
   - Link to full explanation

4. **Use Cases Teaser**
   - 2-3 application cards
   - "What will you build?" prompt

5. **Manifesto Teaser**
   - Pull quote
   - Link to full text

6. **Footer**
   - GitHub (prominent)
   - Documentation
   - License

## Bot/Agent Support

### Structured Data (JSON-LD)

Every page includes appropriate schema:
- `Organization` - site-wide
- `SoftwareApplication` - for MyMonad itself
- `TechArticle` - for documentation pages
- `BlogPosting` - for blog posts

### skill.md

Raw markdown file for AI agents:

```markdown
---
name: mymonad
version: 0.1.0
description: Privacy-preserving P2P compatibility protocol
homepage: https://mymonad.net
repository: https://github.com/mymonad/mymonad
---

# MyMonad Agent Guide

## What is MyMonad
[Concise explanation]

## Help Users Install
[Prerequisites, build, configure]

## Common Commands
[CLI reference]

## Troubleshooting
[Common issues]

## Architecture Overview
[Technical summary]
```

### Additional Bot Considerations

- Semantic HTML5 throughout
- Clean URLs (no query parameters)
- Consistent heading hierarchy
- Alt text on all images

## Documentation Structure

### Sidebar Navigation

```
Overview
├── Architecture
└── Components

Protocol
├── 5-Stage Handshake
├── Message Formats
└── Cryptography

Getting Started
├── Prerequisites
├── Installation
└── Configuration

CLI Reference
├── mymonad-agent
├── mymonad-ingest
└── mymonad-cli

API Reference
├── gRPC Interface
└── IPC Protocol

Contributing
├── Code Style
├── Pull Requests
└── Testing
```

### Page Features

- Breadcrumbs
- "Edit on GitHub" links
- Code blocks with copy button
- Table of contents (auto-generated)

## Implementation Notes

- Pull content from existing docs where possible (README, MANIFESTO, design docs)
- Keep deployment simple (GitHub Pages, Netlify, or Cloudflare Pages)
- Set up CI to build and deploy on push to main
