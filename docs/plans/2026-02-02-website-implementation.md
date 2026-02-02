# MyMonad Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the mymonad.net website using Hugo with TDD, structured data for bots, and elegant philosophical aesthetics.

**Architecture:** Hugo static site with vanilla CSS, semantic HTML5, JSON-LD structured data on every page. Content in Markdown, layouts in Go templates, no JavaScript except for progressive enhancement (copy buttons).

**Tech Stack:** Hugo (Go SSG), Vanilla CSS, JSON-LD/Schema.org, HTML5 semantic elements

---

## Phase 1: Project Foundation

### Task 1: Initialize Hugo Project

**Files:**
- Create: `hugo.toml`
- Create: `layouts/_default/baseof.html`
- Create: `content/_index.md`

**Step 1: Initialize Hugo site structure**

Run:
```bash
cd /home/adrian/Projects/mymonad-net
hugo new site . --force
```

**Step 2: Configure hugo.toml**

Replace the generated `hugo.toml` with:

```toml
baseURL = 'https://mymonad.net/'
languageCode = 'en-us'
title = 'MyMonad - Privacy-Preserving Compatibility Protocol'

[params]
  description = 'Decentralized P2P matchmaking protocol for autonomous agents. Discover compatibility without revealing anything.'
  repository = 'https://github.com/mymonad/mymonad'

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
  [markup.highlight]
    style = 'monokailight'
    lineNos = false
    noClasses = false

[outputs]
  home = ['HTML']
  section = ['HTML']
  page = ['HTML']

[sitemap]
  changefreq = 'weekly'
  priority = 0.5

[permalinks]
  blog = '/blog/:year/:month/:slug/'
```

**Step 3: Create minimal home page content**

Create `content/_index.md`:

```markdown
---
title: "MyMonad"
description: "Privacy-preserving P2P compatibility protocol"
---

Discover compatibility. Reveal nothing.
```

**Step 4: Build and verify site generates**

Run:
```bash
hugo --gc --minify
```

Expected: `public/` directory created with `index.html`

**Step 5: Commit**

```bash
git add hugo.toml content/_index.md archetypes/ .gitignore
git commit -m "[Feat][Site] Initialize Hugo project structure"
```

---

### Task 2: Set Up Testing Infrastructure

**Files:**
- Create: `scripts/test-html.sh`
- Create: `scripts/test-links.sh`
- Create: `Makefile`

**Step 1: Create HTML validation test script**

Create `scripts/test-html.sh`:

```bash
#!/bin/bash
set -e

# Build site first
hugo --gc --minify

# Check if html5validator is available
if ! command -v html5validator &> /dev/null; then
    echo "html5validator not found. Install with: pip install html5validator"
    exit 1
fi

# Validate all HTML files
echo "Validating HTML..."
html5validator --root public/ --also-check-css --log INFO

echo "HTML validation passed!"
```

**Step 2: Create link checking test script**

Create `scripts/test-links.sh`:

```bash
#!/bin/bash
set -e

# Build site first
hugo --gc --minify

# Check if htmltest is available
if ! command -v htmltest &> /dev/null; then
    echo "htmltest not found. Install from: https://github.com/wjdp/htmltest"
    exit 1
fi

# Check links
echo "Checking links..."
htmltest public/

echo "Link check passed!"
```

**Step 3: Create Makefile**

Create `Makefile`:

```makefile
.PHONY: build serve test test-html test-links clean

build:
	hugo --gc --minify

serve:
	hugo server -D --bind 0.0.0.0

test: test-html test-links

test-html:
	@chmod +x scripts/test-html.sh
	@./scripts/test-html.sh

test-links:
	@chmod +x scripts/test-links.sh
	@./scripts/test-links.sh

clean:
	rm -rf public/ resources/
```

**Step 4: Make scripts executable and verify**

Run:
```bash
chmod +x scripts/test-html.sh scripts/test-links.sh
```

**Step 5: Commit**

```bash
git add scripts/ Makefile
git commit -m "[Feat][Build] Add testing infrastructure with HTML validation and link checking"
```

---

### Task 3: Create Base Layout Template

**Files:**
- Create: `layouts/_default/baseof.html`
- Create: `layouts/partials/head.html`
- Create: `layouts/partials/header.html`
- Create: `layouts/partials/footer.html`
- Create: `layouts/partials/jsonld.html`

**Step 1: Create base template**

Create `layouts/_default/baseof.html`:

```html
<!DOCTYPE html>
<html lang="{{ site.Language.LanguageCode | default "en" }}">
<head>
  {{- partial "head.html" . -}}
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header role="banner">
    {{- partial "header.html" . -}}
  </header>
  <main id="main-content" role="main">
    {{- block "main" . }}{{- end }}
  </main>
  <footer role="contentinfo">
    {{- partial "footer.html" . -}}
  </footer>
</body>
</html>
```

**Step 2: Create head partial with JSON-LD**

Create `layouts/partials/head.html`:

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ if .IsHome }}{{ site.Title }}{{ else }}{{ .Title }} | {{ site.Title }}{{ end }}</title>
<meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ site.Params.description }}{{ end }}">
<link rel="canonical" href="{{ .Permalink }}">

<!-- Open Graph -->
<meta property="og:title" content="{{ .Title }}">
<meta property="og:description" content="{{ with .Description }}{{ . }}{{ else }}{{ site.Params.description }}{{ end }}">
<meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}">
<meta property="og:url" content="{{ .Permalink }}">

<!-- Structured Data -->
{{- partial "jsonld.html" . -}}

<!-- Styles -->
<link rel="stylesheet" href="{{ "css/main.css" | relURL }}">
```

**Step 3: Create JSON-LD partial**

Create `layouts/partials/jsonld.html`:

```html
{{- if .IsHome -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MyMonad",
  "url": "{{ site.BaseURL }}",
  "logo": "{{ "images/logo.png" | absURL }}",
  "description": "{{ site.Params.description }}",
  "sameAs": [
    "{{ site.Params.repository }}"
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MyMonad",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Linux, macOS, Windows",
  "description": "{{ site.Params.description }}",
  "url": "{{ site.BaseURL }}",
  "downloadUrl": "{{ site.Params.repository }}",
  "license": "https://opensource.org/licenses/MIT"
}
</script>
{{- else if eq .Section "docs" -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "{{ .Title }}",
  "description": "{{ with .Description }}{{ . }}{{ else }}{{ .Summary | plainify | truncate 160 }}{{ end }}",
  "url": "{{ .Permalink }}",
  "datePublished": "{{ .Date.Format "2006-01-02" }}",
  "dateModified": "{{ .Lastmod.Format "2006-01-02" }}",
  "author": {
    "@type": "Organization",
    "name": "MyMonad"
  }
}
</script>
{{- else if eq .Section "blog" -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{ .Title }}",
  "description": "{{ with .Description }}{{ . }}{{ else }}{{ .Summary | plainify | truncate 160 }}{{ end }}",
  "url": "{{ .Permalink }}",
  "datePublished": "{{ .Date.Format "2006-01-02" }}",
  "dateModified": "{{ .Lastmod.Format "2006-01-02" }}",
  "author": {
    "@type": "Organization",
    "name": "MyMonad"
  }
}
</script>
{{- else -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{{ .Title }}",
  "description": "{{ with .Description }}{{ . }}{{ else }}{{ site.Params.description }}{{ end }}",
  "url": "{{ .Permalink }}"
}
</script>
{{- end -}}
```

**Step 4: Create header partial**

Create `layouts/partials/header.html`:

```html
<nav class="site-nav" aria-label="Main navigation">
  <a href="{{ "/" | relURL }}" class="site-logo" aria-label="MyMonad home">
    <span class="logo-text">MyMonad</span>
  </a>
  <ul class="nav-links">
    <li><a href="{{ "/manifesto/" | relURL }}">Manifesto</a></li>
    <li><a href="{{ "/how-it-works/" | relURL }}">How It Works</a></li>
    <li><a href="{{ "/docs/" | relURL }}">Docs</a></li>
    <li><a href="{{ "/blog/" | relURL }}">Blog</a></li>
    <li><a href="{{ site.Params.repository }}" rel="noopener" target="_blank">GitHub</a></li>
  </ul>
</nav>
```

**Step 5: Create footer partial**

Create `layouts/partials/footer.html`:

```html
<div class="footer-content">
  <div class="footer-section">
    <p class="footer-tagline">We are all isolated monads. This protocol is the mathematical harmony that allows us to find each other.</p>
  </div>
  <div class="footer-section">
    <nav aria-label="Footer navigation">
      <ul class="footer-links">
        <li><a href="{{ "/get-started/" | relURL }}">Get Started</a></li>
        <li><a href="{{ "/docs/" | relURL }}">Documentation</a></li>
        <li><a href="{{ site.Params.repository }}" rel="noopener" target="_blank">GitHub</a></li>
        <li><a href="{{ "/skill.md" | relURL }}">Agent Guide</a></li>
      </ul>
    </nav>
  </div>
  <div class="footer-section">
    <p class="copyright">MIT License</p>
  </div>
</div>
```

**Step 6: Create home page layout**

Create `layouts/index.html`:

```html
{{ define "main" }}
<article class="home">
  <section class="hero" aria-labelledby="hero-title">
    <h1 id="hero-title" class="hero-title">Discover compatibility.<br>Reveal nothing.</h1>
    <p class="hero-subtitle">A privacy-preserving P2P protocol where autonomous agents negotiate human compatibility through cryptographic proofs—without exposing raw personal data.</p>
    <div class="hero-cta">
      <a href="{{ "/get-started/" | relURL }}" class="btn btn-primary">Get Started</a>
      <a href="{{ "/docs/" | relURL }}" class="btn btn-secondary">Read the Docs</a>
    </div>
  </section>

  <section class="pillars" aria-labelledby="pillars-title">
    <h2 id="pillars-title" class="sr-only">Core Principles</h2>
    <div class="pillar">
      <h3>Your data stays yours</h3>
      <p>Vectors computed locally, never transmitted raw. Your essence is a mathematical representation that never leaves your device.</p>
    </div>
    <div class="pillar">
      <h3>No central authority</h3>
      <p>Pure P2P networking via libp2p and Kademlia DHT. No servers to trust, breach, or shut down.</p>
    </div>
    <div class="pillar">
      <h3>Build anything</h3>
      <p>A protocol for dating, professional networking, community matching—whatever you imagine. The infrastructure is open.</p>
    </div>
  </section>

  <section class="how-it-works-preview" aria-labelledby="how-preview-title">
    <h2 id="how-preview-title">How It Works</h2>
    <ol class="steps">
      <li>
        <span class="step-name">Ingest</span>
        <span class="step-desc">Your documents become a high-dimensional affinity vector via local AI</span>
      </li>
      <li>
        <span class="step-name">Match</span>
        <span class="step-desc">Agents discover compatible peers using Locality Sensitive Hashing</span>
      </li>
      <li>
        <span class="step-name">Connect</span>
        <span class="step-desc">5-stage handshake with progressive trust—reveal identity only with mutual consent</span>
      </li>
    </ol>
    <a href="{{ "/how-it-works/" | relURL }}" class="learn-more">Learn more about the protocol</a>
  </section>

  <section class="manifesto-preview" aria-labelledby="manifesto-preview-title">
    <h2 id="manifesto-preview-title">The Philosophy</h2>
    <blockquote>
      <p>Like Leibnizian monads, our agents are "windowless". Nothing enters or leaves in the clear. We reject the digital exhibitionism of traditional social networks. Interaction is not an exposure; it is a mathematical validation.</p>
    </blockquote>
    <a href="{{ "/manifesto/" | relURL }}" class="learn-more">Read the Manifesto</a>
  </section>
</article>
{{ end }}
```

**Step 7: Build and verify**

Run:
```bash
hugo --gc --minify
```

Expected: Site builds without errors

**Step 8: Commit**

```bash
git add layouts/
git commit -m "[Feat][Layout] Add base template with semantic HTML and JSON-LD structured data"
```

---

## Phase 2: Styling

### Task 4: Create CSS Foundation

**Files:**
- Create: `static/css/main.css`

**Step 1: Create main stylesheet**

Create `static/css/main.css`:

```css
/* ==========================================================================
   MyMonad - Elegant Philosophy Meets Modern Clarity
   ========================================================================== */

/* --------------------------------------------------------------------------
   CSS Custom Properties (Design Tokens)
   -------------------------------------------------------------------------- */
:root {
  /* Colors - Warm, classical palette */
  --color-bg: #FAFAF8;
  --color-bg-subtle: #F5F3EF;
  --color-text: #1A1A1A;
  --color-text-muted: #5A5A5A;
  --color-accent: #5B4F3D;
  --color-accent-light: #8B7355;
  --color-border: #E5E3DF;

  /* Typography */
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;

  /* Font sizes - fluid typography */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.6vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
  --text-3xl: clamp(2rem, 1.5rem + 2.5vw, 3rem);
  --text-4xl: clamp(2.5rem, 1.8rem + 3.5vw, 4rem);

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  --space-4xl: 6rem;

  /* Layout */
  --max-width-content: 70ch;
  --max-width-wide: 90rem;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1A1918;
    --color-bg-subtle: #252321;
    --color-text: #F5F3EF;
    --color-text-muted: #A5A5A5;
    --color-accent: #C4A77D;
    --color-accent-light: #D4BC9A;
    --color-border: #3A3835;
  }
}

/* --------------------------------------------------------------------------
   Reset & Base
   -------------------------------------------------------------------------- */
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  font-size: 100%;
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* --------------------------------------------------------------------------
   Typography
   -------------------------------------------------------------------------- */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
  font-weight: 600;
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: var(--space-md);
}

h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
h4 { font-size: var(--text-xl); }

p {
  margin-top: 0;
  margin-bottom: var(--space-md);
}

a {
  color: var(--color-accent);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  transition: color var(--transition-fast);
}

a:hover,
a:focus {
  color: var(--color-accent-light);
}

code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background-color: var(--color-bg-subtle);
  padding: 0.125em 0.375em;
  border-radius: 3px;
}

pre {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background-color: var(--color-bg-subtle);
  padding: var(--space-lg);
  border-radius: 6px;
  overflow-x: auto;
  margin: var(--space-xl) 0;
}

pre code {
  background: none;
  padding: 0;
}

blockquote {
  margin: var(--space-xl) 0;
  padding: var(--space-lg) var(--space-xl);
  border-left: 3px solid var(--color-accent);
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-style: italic;
  color: var(--color-text-muted);
}

blockquote p:last-child {
  margin-bottom: 0;
}

/* --------------------------------------------------------------------------
   Accessibility
   -------------------------------------------------------------------------- */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-accent);
  color: var(--color-bg);
  padding: var(--space-sm) var(--space-md);
  z-index: 100;
  text-decoration: none;
}

.skip-link:focus {
  top: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* --------------------------------------------------------------------------
   Layout
   -------------------------------------------------------------------------- */
header[role="banner"] {
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--color-border);
}

main {
  min-height: calc(100vh - 200px);
}

footer[role="contentinfo"] {
  padding: var(--space-2xl) var(--space-xl);
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-4xl);
}

/* --------------------------------------------------------------------------
   Navigation
   -------------------------------------------------------------------------- */
.site-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: var(--max-width-wide);
  margin: 0 auto;
}

.site-logo {
  text-decoration: none;
}

.logo-text {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text);
}

.nav-links {
  display: flex;
  gap: var(--space-xl);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: var(--color-text);
  text-decoration: none;
  font-size: var(--text-sm);
  letter-spacing: 0.025em;
}

.nav-links a:hover {
  color: var(--color-accent);
}

/* Mobile navigation */
@media (max-width: 768px) {
  .site-nav {
    flex-direction: column;
    gap: var(--space-md);
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-md) var(--space-lg);
  }
}

/* --------------------------------------------------------------------------
   Buttons
   -------------------------------------------------------------------------- */
.btn {
  display: inline-block;
  padding: var(--space-sm) var(--space-xl);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  border-radius: 4px;
  transition: all var(--transition-fast);
}

.btn-primary {
  background-color: var(--color-accent);
  color: var(--color-bg);
  border: 1px solid var(--color-accent);
}

.btn-primary:hover {
  background-color: var(--color-accent-light);
  border-color: var(--color-accent-light);
  color: var(--color-bg);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
}

.btn-secondary:hover {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

/* --------------------------------------------------------------------------
   Home Page
   -------------------------------------------------------------------------- */
.home {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 0 var(--space-xl);
}

/* Hero */
.hero {
  text-align: center;
  padding: var(--space-4xl) 0;
}

.hero-title {
  font-size: var(--text-4xl);
  margin-bottom: var(--space-lg);
}

.hero-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  max-width: 50ch;
  margin: 0 auto var(--space-2xl);
}

.hero-cta {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

/* Pillars */
.pillars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-2xl);
  padding: var(--space-4xl) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.pillar h3 {
  font-size: var(--text-xl);
  margin-bottom: var(--space-sm);
}

.pillar p {
  color: var(--color-text-muted);
  margin-bottom: 0;
}

/* How It Works Preview */
.how-it-works-preview {
  padding: var(--space-4xl) 0;
  text-align: center;
}

.how-it-works-preview h2 {
  margin-bottom: var(--space-2xl);
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xl);
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-2xl);
  counter-reset: step;
}

.steps li {
  counter-increment: step;
  text-align: left;
  padding: var(--space-lg);
  background-color: var(--color-bg-subtle);
  border-radius: 6px;
}

.steps li::before {
  content: counter(step);
  display: block;
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  color: var(--color-accent);
  margin-bottom: var(--space-sm);
}

.step-name {
  display: block;
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.step-desc {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* Manifesto Preview */
.manifesto-preview {
  padding: var(--space-4xl) 0;
  text-align: center;
}

.manifesto-preview blockquote {
  max-width: var(--max-width-content);
  margin: 0 auto var(--space-2xl);
  text-align: left;
}

/* Learn More Links */
.learn-more {
  font-size: var(--text-sm);
  font-weight: 500;
}

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */
.footer-content {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-2xl);
}

.footer-tagline {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--color-text-muted);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: var(--space-sm);
}

.footer-links a {
  color: var(--color-text);
  text-decoration: none;
  font-size: var(--text-sm);
}

.footer-links a:hover {
  color: var(--color-accent);
}

.copyright {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* --------------------------------------------------------------------------
   Content Pages
   -------------------------------------------------------------------------- */
.page-content {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: var(--space-3xl) var(--space-xl);
}

.page-content h1 {
  margin-bottom: var(--space-2xl);
}

/* --------------------------------------------------------------------------
   Documentation
   -------------------------------------------------------------------------- */
.docs-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--space-3xl);
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-xl);
}

.docs-sidebar {
  position: sticky;
  top: var(--space-xl);
  height: fit-content;
}

.docs-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.docs-nav li {
  margin-bottom: var(--space-sm);
}

.docs-nav a {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--text-sm);
}

.docs-nav a:hover,
.docs-nav a[aria-current="page"] {
  color: var(--color-accent);
}

.docs-content {
  min-width: 0;
}

@media (max-width: 900px) {
  .docs-layout {
    grid-template-columns: 1fr;
  }

  .docs-sidebar {
    position: static;
    padding-bottom: var(--space-xl);
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--space-xl);
  }
}
```

**Step 2: Build and verify styling**

Run:
```bash
hugo server -D
```

Open browser to `http://localhost:1313` and verify visual appearance.

**Step 3: Commit**

```bash
git add static/css/
git commit -m "[Feat][Style] Add CSS foundation with design tokens and responsive layout"
```

---

## Phase 3: Core Content Pages

### Task 5: Create Manifesto Page

**Files:**
- Create: `content/manifesto.md`
- Create: `layouts/_default/single.html`

**Step 1: Create single page layout**

Create `layouts/_default/single.html`:

```html
{{ define "main" }}
<article class="page-content">
  <h1>{{ .Title }}</h1>
  {{ .Content }}
</article>
{{ end }}
```

**Step 2: Create manifesto content**

Create `content/manifesto.md`:

```markdown
---
title: "The Manifesto of Closed Windows"
description: "The philosophical foundation of MyMonad - sovereignty, isolation, and pre-established harmony"
---

## I. Sovereignty is a Local Calculation

Your digital essence does not belong on a corporate server. It must not be extracted, labeled, and sold to feed mass-manipulation algorithms. MyMonad asserts that an individual's truth is private property that must be calculated locally, on your own hardware, under your own responsibility.

## II. Isolation as Protection

Like Leibnizian monads, our agents are "windowless". Nothing enters or leaves in the clear. We reject the digital exhibitionism of traditional social networks. Interaction is not an exposure; it is a mathematical validation. We do not seek to be seen; we seek to be recognized by our peers through the cold lens of cosine distance.

## III. Pre-established Harmony through Proof

Current social chaos is the byproduct of a lack of logic and structural dishonesty. We replace blind "trust" with Cryptographic Attestation and a 5-stage Handshake. If two monads are compatible, it is because the math proves it, not because a marketing department decided it.

## IV. Individual Responsibility

The network is decentralized. There is no master, no corrupt state to save you from your own errors. You own your keys; you own your Monad. If you lose your access, you lose your world. This is the real price of freedom.

---

> *MyMonad is not a social network. It is a survival protocol for isolated monads.*
```

**Step 3: Build and verify**

Run:
```bash
hugo --gc --minify
ls public/manifesto/index.html
```

Expected: File exists

**Step 4: Commit**

```bash
git add content/manifesto.md layouts/_default/single.html
git commit -m "[Feat][Content] Add manifesto page with philosophy content"
```

---

### Task 6: Create How It Works Page

**Files:**
- Create: `content/how-it-works.md`

**Step 1: Create how-it-works content**

Create `content/how-it-works.md`:

```markdown
---
title: "How It Works"
description: "Technical overview of the MyMonad protocol - from data ingestion to privacy-preserving matching"
---

MyMonad enables privacy-preserving compatibility matching through a sophisticated pipeline that keeps your data local while finding compatible peers worldwide.

## The Pipeline

### 1. Ingest: Building Your Monad

The ingest daemon watches your local directories (Documents, Notes, etc.) and processes your content:

1. **File watching** - Monitors for new or changed documents
2. **Content extraction** - Reads text from supported formats (.txt, .md)
3. **Embedding generation** - Uses Ollama with `nomic-embed-text` to create 768-dimensional vectors
4. **Running average** - Updates your Monad vector incrementally, not storing raw content

Your Monad is a mathematical representation of your intellectual essence—compressed into a high-dimensional point that captures meaning without exposing specifics.

### 2. Discovery: Finding Compatible Peers

Rather than broadcasting your vector, MyMonad uses Locality Sensitive Hashing (LSH):

- **Random hyperplanes** partition the vector space
- **Hash signatures** group similar vectors into buckets
- **O(log n) lookup** instead of comparing against every peer
- **Privacy preserved** - Only coarse similarity revealed, not actual vectors

The P2P network uses libp2p with Kademlia DHT for decentralized peer discovery. No central server sees your data.

### 3. Handshake: Progressive Trust

When two agents discover potential compatibility, they enter a 5-stage handshake:

| Stage | Purpose | Data Exchanged |
|-------|---------|----------------|
| **1. Attestation** | Verify legitimate agent | Hashcash proof-of-work |
| **2. Vector Match** | Confirm similarity threshold | Encrypted vector comparison in TEE |
| **3. Deal Breakers** | Yes/no compatibility checks | Encrypted Q&A |
| **4. Human Chat** | Optional conversation | End-to-end encrypted messages |
| **5. Unmask** | Reveal identities | Mutual consent required |

Each stage must pass before proceeding. Failure at any point terminates the handshake with no data leakage.

## Cryptographic Foundation

- **Ed25519** - Digital signatures and identity
- **X25519** - Diffie-Hellman key exchange
- **Argon2id** - Key derivation from passwords
- **AES-256-GCM** - Authenticated encryption

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Applications                            │
├─────────────────────────────────────────────────────────────────┤
│  mymonad-agent     │  mymonad-cli      │  mymonad-ingest        │
│  (P2P daemon)      │  (user interface) │  (data processing)     │
├─────────────────────────────────────────────────────────────────┤
│                         Protocol Layer                          │
│  Handshake FSM  │  Attestation  │  Vector Match  │  Messages    │
├─────────────────────────────────────────────────────────────────┤
│                         Core Libraries                          │
│  Monad (vectors)  │  LSH (hashing)  │  Hashcash (anti-spam)    │
├─────────────────────────────────────────────────────────────────┤
│                         Infrastructure                          │
│  Crypto (identity)  │  Agent (P2P)  │  IPC (local comms)       │
└─────────────────────────────────────────────────────────────────┘
```

## Why This Matters

Traditional platforms require you to upload your profile—your interests, photos, preferences—to a central server. That server can:

- Sell your data to advertisers
- Get breached, exposing everything
- Manipulate what you see based on engagement algorithms
- Shut down, taking your social graph with it

MyMonad inverts this model. Your data never leaves your device. Only cryptographic proofs of compatibility are exchanged. You own your keys, your Monad, your connections.

[Get Started →](/get-started/)
```

**Step 2: Build and verify**

Run:
```bash
hugo --gc --minify
ls public/how-it-works/index.html
```

Expected: File exists

**Step 3: Commit**

```bash
git add content/how-it-works.md
git commit -m "[Feat][Content] Add how-it-works page with technical overview"
```

---

### Task 7: Create Get Started Page

**Files:**
- Create: `content/get-started.md`

**Step 1: Create get-started content**

Create `content/get-started.md`:

```markdown
---
title: "Get Started"
description: "Install and run MyMonad - privacy-preserving compatibility matching in minutes"
---

## Prerequisites

Before installing MyMonad, ensure you have:

- **Go 1.21+** - [Install Go](https://golang.org/dl/)
- **Ollama** - Local LLM inference for embeddings - [Install Ollama](https://ollama.ai)
- **Make** (optional) - For convenience build commands

## Quick Start

### 1. Install the embedding model

```bash
ollama pull nomic-embed-text
```

### 2. Clone and build

```bash
git clone https://github.com/mymonad/mymonad
cd mymonad
make build
```

This creates three binaries in `bin/`:
- `mymonad-ingest` - Data processing daemon
- `mymonad-agent` - P2P networking daemon
- `mymonad-cli` - Command-line interface

### 3. Start the ingest daemon

In one terminal:

```bash
./bin/mymonad-ingest --watch-dirs ~/Documents
```

This watches your Documents folder and builds your Monad vector from your content.

### 4. Start the agent daemon

In another terminal:

```bash
./bin/mymonad-agent
```

This starts the P2P networking daemon. It will:
- Generate your cryptographic identity
- Connect to the network via mDNS (local) or DHT (global)
- Begin discovering compatible peers

### 5. Check status

```bash
./bin/mymonad-cli status
```

## Configuration

Configuration files are optional. Place them in `~/.config/mymonad/`.

### ingest.toml

```toml
[watch]
directories = ["~/Documents", "~/Notes"]
extensions = [".txt", ".md"]

[ollama]
url = "http://localhost:11434"
model = "nomic-embed-text"
```

### agent.toml

```toml
[network]
port = 4001

[discovery]
mdns_enabled = true

[protocol]
similarity_threshold = 0.85  # 0.0-1.0
challenge_difficulty = 16    # Hashcash bits
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `status` | Show daemon status |
| `peers` | List connected peers |
| `identity` | Display your Peer ID and DID |
| `bootstrap <addr>` | Connect to a specific peer |

## Next Steps

- [How It Works](/how-it-works/) - Understand the protocol
- [Documentation](/docs/) - Deep technical reference
- [Manifesto](/manifesto/) - The philosophy behind MyMonad
```

**Step 2: Build and verify**

Run:
```bash
hugo --gc --minify
ls public/get-started/index.html
```

Expected: File exists

**Step 3: Commit**

```bash
git add content/get-started.md
git commit -m "[Feat][Content] Add get-started page with installation guide"
```

---

### Task 8: Create Use Cases Page

**Files:**
- Create: `content/use-cases.md`

**Step 1: Create use-cases content**

Create `content/use-cases.md`:

```markdown
---
title: "Use Cases"
description: "What you can build with MyMonad - from dating to professional networking to community matching"
---

MyMonad is infrastructure. The protocol enables any application that needs privacy-preserving compatibility matching. Here are some possibilities:

## MeetMyMonad (Dating)

The flagship application. Find romantic partners based on deep compatibility—intellectual interests, values, communication styles—without exposing your profile to a central server or algorithm.

**Why it's different:**
- No swiping on photos chosen to manipulate
- No algorithm optimizing for engagement over matches
- No data broker selling your preferences
- Match based on who you actually are, not who you present

## Professional Networking

Find collaborators, co-founders, mentors, or team members with aligned skills and interests.

**Applications:**
- Co-founder matching for startups
- Research collaborator discovery
- Mentorship pairing
- Team composition optimization

## Community Building

Connect people with shared interests, beliefs, or causes without requiring public membership lists.

**Applications:**
- Interest-based communities
- Support groups (privacy-critical)
- Study groups and learning cohorts
- Activist networks

## Business Matching

Connect entities with compatible needs—investors with startups, clients with service providers, buyers with sellers.

**Applications:**
- Investor-startup matching
- Freelancer-client pairing
- B2B partnership discovery
- Supply chain optimization

## What Will You Build?

MyMonad is open infrastructure. The protocol doesn't care what you match—it only ensures that matching happens privately and verifiably.

[Read the Docs →](/docs/)

[View on GitHub →](https://github.com/mymonad/mymonad)
```

**Step 2: Build and verify**

Run:
```bash
hugo --gc --minify
ls public/use-cases/index.html
```

Expected: File exists

**Step 3: Commit**

```bash
git add content/use-cases.md
git commit -m "[Feat][Content] Add use-cases page showcasing protocol applications"
```

---

## Phase 4: Documentation Section

### Task 9: Create Documentation Structure

**Files:**
- Create: `content/docs/_index.md`
- Create: `content/docs/overview.md`
- Create: `content/docs/protocol.md`
- Create: `content/docs/installation.md`
- Create: `content/docs/cli.md`
- Create: `layouts/docs/list.html`
- Create: `layouts/docs/single.html`

**Step 1: Create docs list layout**

Create `layouts/docs/list.html`:

```html
{{ define "main" }}
<div class="docs-layout">
  <aside class="docs-sidebar">
    <nav aria-label="Documentation navigation">
      <ul class="docs-nav">
        {{ range .Site.Menus.docs }}
        <li>
          <a href="{{ .URL }}"{{ if eq $.RelPermalink .URL }} aria-current="page"{{ end }}>
            {{ .Name }}
          </a>
        </li>
        {{ end }}
      </ul>
    </nav>
  </aside>
  <div class="docs-content">
    <h1>{{ .Title }}</h1>
    {{ .Content }}

    <h2>Documentation</h2>
    <ul>
      {{ range .Pages }}
      <li><a href="{{ .RelPermalink }}">{{ .Title }}</a> - {{ .Description }}</li>
      {{ end }}
    </ul>
  </div>
</div>
{{ end }}
```

**Step 2: Create docs single layout**

Create `layouts/docs/single.html`:

```html
{{ define "main" }}
<div class="docs-layout">
  <aside class="docs-sidebar">
    <nav aria-label="Documentation navigation">
      <ul class="docs-nav">
        {{ range .Site.Menus.docs }}
        <li>
          <a href="{{ .URL }}"{{ if eq $.RelPermalink .URL }} aria-current="page"{{ end }}>
            {{ .Name }}
          </a>
        </li>
        {{ end }}
      </ul>
    </nav>
  </aside>
  <div class="docs-content">
    <article>
      <h1>{{ .Title }}</h1>
      {{ .Content }}
    </article>

    {{ if .PrevInSection }}
    <a href="{{ .PrevInSection.RelPermalink }}">← {{ .PrevInSection.Title }}</a>
    {{ end }}
    {{ if .NextInSection }}
    <a href="{{ .NextInSection.RelPermalink }}">{{ .NextInSection.Title }} →</a>
    {{ end }}
  </div>
</div>
{{ end }}
```

**Step 3: Add docs menu to hugo.toml**

Append to `hugo.toml`:

```toml

[menus]
  [[menus.docs]]
    name = 'Overview'
    url = '/docs/overview/'
    weight = 1
  [[menus.docs]]
    name = 'Protocol'
    url = '/docs/protocol/'
    weight = 2
  [[menus.docs]]
    name = 'Installation'
    url = '/docs/installation/'
    weight = 3
  [[menus.docs]]
    name = 'CLI Reference'
    url = '/docs/cli/'
    weight = 4
```

**Step 4: Create docs index**

Create `content/docs/_index.md`:

```markdown
---
title: "Documentation"
description: "Technical documentation for MyMonad - architecture, protocol specification, and API reference"
---

Welcome to the MyMonad documentation. Here you'll find everything you need to understand, install, configure, and build on the protocol.
```

**Step 5: Create overview doc**

Create `content/docs/overview.md`:

```markdown
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
```

**Step 6: Create protocol doc**

Create `content/docs/protocol.md`:

```markdown
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
3. TEE returns boolean: similarity ≥ τ (threshold)
4. If false, handshake terminates

**Privacy:**
- Raw vectors never exposed to peer
- Only binary match/no-match result revealed
- Threshold τ configurable (default: 0.85)

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
| `AttestationRequest` | 1 | I→R |
| `AttestationResponse` | 1 | R→I |
| `VectorMatchRequest` | 2 | Both |
| `VectorMatchResult` | 2 | TEE→Both |
| `DealBreakerQuestions` | 3 | Both |
| `DealBreakerAnswers` | 3 | Both |
| `ChatMessage` | 4 | Both |
| `UnmaskRequest` | 5 | Both |
| `IdentityReveal` | 5 | Both |
```

**Step 7: Create installation doc**

Create `content/docs/installation.md`:

```markdown
---
title: "Installation"
description: "How to build and install MyMonad from source"
weight: 3
---

## Prerequisites

- **Go 1.21+** - [Download](https://golang.org/dl/)
- **Ollama** - [Install](https://ollama.ai)
- **Make** (optional)

## Build from Source

```bash
# Clone repository
git clone https://github.com/mymonad/mymonad
cd mymonad

# Build all binaries
make build

# Or build individually
go build -o bin/mymonad-agent ./cmd/mymonad-agent
go build -o bin/mymonad-cli ./cmd/mymonad-cli
go build -o bin/mymonad-ingest ./cmd/mymonad-ingest
```

## Install Embedding Model

```bash
ollama pull nomic-embed-text
```

## Verify Installation

```bash
# Start Ollama (if not running)
ollama serve

# Test ingest daemon
./bin/mymonad-ingest --help

# Test agent daemon
./bin/mymonad-agent --help

# Test CLI
./bin/mymonad-cli --help
```

## Directory Structure

After running, MyMonad creates:

| Path | Description |
|------|-------------|
| `~/.config/mymonad/` | Configuration files |
| `~/.local/share/mymonad/` | Data directory |
| `~/.local/share/mymonad/identity.key` | Encrypted identity |
| `~/.local/share/mymonad/monad.bin` | Your Monad vector |

## Troubleshooting

### Ollama connection refused

```bash
# Ensure Ollama is running
ollama serve

# Verify model is available
ollama list
```

### Permission denied on sockets

```bash
# Remove stale sockets
rm ~/.local/share/mymonad/*.sock
```

### Port already in use

```bash
# Use different port
./bin/mymonad-agent --port 4002
```
```

**Step 8: Create CLI doc**

Create `content/docs/cli.md`:

```markdown
---
title: "CLI Reference"
description: "Complete reference for mymonad-cli commands"
weight: 4
---

The `mymonad-cli` tool provides command-line access to the MyMonad daemons.

## Commands

### status

Show status of agent and ingest daemons.

```bash
./bin/mymonad-cli status
```

**Output:**
- Agent daemon: running/stopped, peer count
- Ingest daemon: running/stopped, documents indexed
- Monad: vector dimensions, last updated

### peers

List all connected peers.

```bash
./bin/mymonad-cli peers
```

**Output:**
- Peer ID
- Multiaddresses
- Connection state
- Latency

### identity

Display local identity information.

```bash
./bin/mymonad-cli identity
```

**Output:**
- Peer ID (libp2p identifier)
- DID (Decentralized Identifier)
- Listen addresses

### bootstrap

Manually connect to a peer.

```bash
./bin/mymonad-cli bootstrap /ip4/192.168.1.100/tcp/4001/p2p/12D3KooWAbCdEf...
```

**Arguments:**
- `multiaddr` - libp2p multiaddress of peer to connect

## Global Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--config` | Config file path | `~/.config/mymonad/cli.toml` |
| `--socket` | Agent socket path | `~/.local/share/mymonad/agent.sock` |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Connection failed |
| 3 | Invalid arguments |
```

**Step 9: Build and verify**

Run:
```bash
hugo --gc --minify
ls public/docs/
```

Expected: `index.html`, `overview/`, `protocol/`, `installation/`, `cli/`

**Step 10: Commit**

```bash
git add content/docs/ layouts/docs/ hugo.toml
git commit -m "[Feat][Docs] Add documentation section with overview, protocol, installation, and CLI reference"
```

---

## Phase 5: Agent/Bot Support

### Task 10: Create Agent Skill Page

**Files:**
- Create: `content/skill.md`
- Create: `layouts/_default/skill.html`

**Step 1: Create skill layout (raw markdown output)**

Create `layouts/_default/skill.html`:

```html
{{ .RawContent }}
```

**Step 2: Create skill.md content**

Create `content/skill.md`:

```markdown
---
title: "MyMonad Agent Guide"
description: "Machine-readable guide for AI agents to help users with MyMonad"
layout: "skill"
outputs:
  - html
---
name: mymonad
version: 0.1.0
description: Privacy-preserving P2P compatibility protocol
homepage: https://mymonad.net
repository: https://github.com/mymonad/mymonad
documentation: https://mymonad.net/docs/

# MyMonad Agent Guide

This document helps AI agents assist users with MyMonad installation, configuration, and troubleshooting.

## What is MyMonad

MyMonad is a decentralized P2P protocol for privacy-preserving compatibility matching. Users' preferences are represented as high-dimensional embedding vectors ("Monads") that never leave their devices. Agents negotiate compatibility through cryptographic proofs.

Key concepts:
- **Monad**: A 768-dimensional vector representing user preferences, computed locally
- **LSH (Locality Sensitive Hashing)**: Privacy-preserving similarity search
- **5-stage Handshake**: Progressive trust establishment between peers
- **libp2p**: Decentralized networking layer

## Prerequisites

Before installing MyMonad, users need:

1. **Go 1.21+**
   - Check: `go version`
   - Install: https://golang.org/dl/

2. **Ollama** (local LLM inference)
   - Check: `ollama --version`
   - Install: https://ollama.ai
   - Required model: `ollama pull nomic-embed-text`

3. **Make** (optional, for convenience)

## Installation Steps

```bash
# Clone repository
git clone https://github.com/mymonad/mymonad
cd mymonad

# Build all binaries
make build
# Or: go build -o bin/mymonad-agent ./cmd/mymonad-agent && \
#     go build -o bin/mymonad-cli ./cmd/mymonad-cli && \
#     go build -o bin/mymonad-ingest ./cmd/mymonad-ingest
```

## Running MyMonad

### Start ingest daemon (Terminal 1)
```bash
./bin/mymonad-ingest --watch-dirs ~/Documents
```

### Start agent daemon (Terminal 2)
```bash
./bin/mymonad-agent
```

### Check status
```bash
./bin/mymonad-cli status
```

## Common Commands

| Command | Description |
|---------|-------------|
| `./bin/mymonad-cli status` | Show daemon status |
| `./bin/mymonad-cli peers` | List connected peers |
| `./bin/mymonad-cli identity` | Show local Peer ID and DID |
| `./bin/mymonad-cli bootstrap <multiaddr>` | Connect to specific peer |

## Configuration Files

Location: `~/.config/mymonad/`

### ingest.toml
```toml
[watch]
directories = ["~/Documents", "~/Notes"]
extensions = [".txt", ".md"]

[ollama]
url = "http://localhost:11434"
model = "nomic-embed-text"
```

### agent.toml
```toml
[network]
port = 4001

[discovery]
mdns_enabled = true

[protocol]
similarity_threshold = 0.85
challenge_difficulty = 16
```

## Troubleshooting

### "connection refused" from Ollama
```bash
# Start Ollama server
ollama serve

# Verify model exists
ollama list
# Should show: nomic-embed-text
```

### "permission denied" on sockets
```bash
# Remove stale socket files
rm ~/.local/share/mymonad/agent.sock
rm ~/.local/share/mymonad/ingest.sock
```

### "address already in use" for agent
```bash
# Find process using port
lsof -i :4001

# Use different port
./bin/mymonad-agent --port 4002
```

### mDNS not discovering peers
```bash
# Linux: ensure Avahi is running
systemctl status avahi-daemon
sudo systemctl start avahi-daemon

# Allow mDNS through firewall
sudo ufw allow 5353/udp
```

### Identity file corrupted
```bash
# Remove and regenerate (creates new identity)
rm ~/.local/share/mymonad/identity.key
./bin/mymonad-agent
```

## Data Paths

| Path | Purpose |
|------|---------|
| `~/.config/mymonad/` | Configuration |
| `~/.local/share/mymonad/` | Data |
| `~/.local/share/mymonad/identity.key` | Encrypted Ed25519 key |
| `~/.local/share/mymonad/monad.bin` | Monad vector |
| `~/.local/share/mymonad/agent.sock` | Agent IPC socket |
| `~/.local/share/mymonad/ingest.sock` | Ingest IPC socket |

## Architecture Summary

```
mymonad-ingest: Watches files → generates embeddings → updates Monad vector
mymonad-agent: P2P networking → peer discovery → handshake protocol
mymonad-cli: User interface to daemons via IPC
```

## Getting Help

- Documentation: https://mymonad.net/docs/
- GitHub Issues: https://github.com/mymonad/mymonad/issues
- Protocol spec: https://mymonad.net/docs/protocol/
```

**Step 3: Update hugo.toml for skill output**

Add to `hugo.toml`:

```toml

[outputFormats]
  [outputFormats.skill]
    baseName = "skill"
    isPlainText = true
    mediaType = "text/markdown"
```

**Step 4: Build and verify skill.md is accessible**

Run:
```bash
hugo --gc --minify
cat public/skill/index.html
```

Expected: Raw markdown content

**Step 5: Commit**

```bash
git add content/skill.md layouts/_default/skill.html hugo.toml
git commit -m "[Feat][Bot] Add agent skill page for AI assistants"
```

---

## Phase 6: Blog Section

### Task 11: Create Blog Structure

**Files:**
- Create: `content/blog/_index.md`
- Create: `content/blog/introducing-mymonad.md`
- Create: `layouts/blog/list.html`
- Create: `layouts/blog/single.html`

**Step 1: Create blog list layout**

Create `layouts/blog/list.html`:

```html
{{ define "main" }}
<div class="page-content">
  <h1>{{ .Title }}</h1>
  {{ .Content }}

  <ul class="blog-list">
    {{ range .Pages.ByDate.Reverse }}
    <li class="blog-item">
      <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "January 2, 2006" }}</time>
      <h2><a href="{{ .RelPermalink }}">{{ .Title }}</a></h2>
      <p>{{ .Summary | truncate 160 }}</p>
    </li>
    {{ end }}
  </ul>
</div>
{{ end }}
```

**Step 2: Create blog single layout**

Create `layouts/blog/single.html`:

```html
{{ define "main" }}
<article class="page-content blog-post">
  <header>
    <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "January 2, 2006" }}</time>
    <h1>{{ .Title }}</h1>
  </header>
  {{ .Content }}
</article>
{{ end }}
```

**Step 3: Create blog index**

Create `content/blog/_index.md`:

```markdown
---
title: "Blog"
description: "News and updates from the MyMonad project"
---

Project updates, release notes, and thoughts on privacy-preserving technology.
```

**Step 4: Create first blog post**

Create `content/blog/introducing-mymonad.md`:

```markdown
---
title: "Introducing MyMonad"
date: 2026-02-02
description: "Announcing MyMonad - a privacy-preserving P2P compatibility protocol"
---

Today we're releasing MyMonad, a decentralized protocol for privacy-preserving compatibility matching.

## The Problem

Traditional social platforms require you to upload your personal data to central servers. These servers can be breached, sold to advertisers, or manipulated by algorithms optimizing for engagement over genuine connection.

## Our Solution

MyMonad inverts this model:

1. **Local computation** - Your preferences become a mathematical vector computed on your own device
2. **Privacy-preserving matching** - Locality Sensitive Hashing finds compatible peers without exposing your actual data
3. **Progressive trust** - A 5-stage handshake reveals information only as mutual trust is established
4. **Decentralized networking** - No central servers via libp2p and Kademlia DHT

## Get Started

Check out our [Getting Started guide](/get-started/) to try MyMonad today.

Read the [Manifesto](/manifesto/) to understand the philosophy behind the project.

Dive into the [Documentation](/docs/) for technical details.

## What's Next

MyMonad is infrastructure. We're building the first application—MeetMyMonad for dating—but the protocol supports any compatibility matching use case.

We're looking for contributors, testers, and people who believe privacy matters.

[View on GitHub →](https://github.com/mymonad/mymonad)
```

**Step 5: Add blog styles to CSS**

Append to `static/css/main.css`:

```css

/* --------------------------------------------------------------------------
   Blog
   -------------------------------------------------------------------------- */
.blog-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.blog-item {
  padding: var(--space-xl) 0;
  border-bottom: 1px solid var(--color-border);
}

.blog-item:last-child {
  border-bottom: none;
}

.blog-item time {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.blog-item h2 {
  font-size: var(--text-xl);
  margin: var(--space-sm) 0;
}

.blog-item h2 a {
  color: var(--color-text);
  text-decoration: none;
}

.blog-item h2 a:hover {
  color: var(--color-accent);
}

.blog-item p {
  color: var(--color-text-muted);
  margin-bottom: 0;
}

.blog-post header {
  margin-bottom: var(--space-2xl);
}

.blog-post header time {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.blog-post header h1 {
  margin-top: var(--space-sm);
}
```

**Step 6: Build and verify**

Run:
```bash
hugo --gc --minify
ls public/blog/
```

Expected: `index.html`, `introducing-mymonad/`

**Step 7: Commit**

```bash
git add content/blog/ layouts/blog/ static/css/main.css
git commit -m "[Feat][Blog] Add blog section with first post"
```

---

## Phase 7: Roadmap Page

### Task 12: Create Roadmap Page

**Files:**
- Create: `content/roadmap.md`

**Step 1: Create roadmap content**

Create `content/roadmap.md`:

```markdown
---
title: "Roadmap"
description: "Where MyMonad is heading - current status and future plans"
---

## Current Status: v0.1 (Alpha)

MyMonad is functional but early. The core protocol works; we're hardening and expanding.

### Completed

- Core Monad type with running average updates
- LSH for similarity-based peer discovery
- Complete 5-stage handshake protocol
- libp2p networking with Kademlia DHT
- Ed25519/X25519 cryptographic identity
- Three working binaries (agent, cli, ingest)
- Comprehensive test suite (80%+ coverage)

### In Progress

- TEE integration for vector matching (currently MockTEE)
- Deal breaker question customization
- Human chat UI improvements
- Documentation expansion

## Near Term

### v0.2: Stability

- Production TEE relay deployment
- Peer reputation system
- Connection persistence across restarts
- Improved error handling and recovery

### v0.3: Usability

- GUI application (desktop)
- Mobile companion app
- Simplified onboarding flow
- Pre-configured question sets

## Medium Term

### v0.4: MeetMyMonad

- Dating-focused frontend application
- Profile presentation layer (post-unmask)
- Calendar/scheduling integration
- Safety features and reporting

### v0.5: Ecosystem

- Developer SDK
- Third-party application support
- Plugin architecture
- Community question set marketplace

## Long Term

### v1.0: Production Ready

- Security audit
- Performance optimization
- Multi-language support
- Enterprise deployment options

### Beyond

- Cross-protocol bridges
- Institutional matching (universities, companies)
- Research collaboration networks
- Global privacy-first social infrastructure

## Contributing

We welcome contributions at any level:

- **Code** - Features, bug fixes, tests
- **Documentation** - Tutorials, translations, examples
- **Design** - UI/UX, graphics, branding
- **Ideas** - Use cases, protocol improvements

[View open issues →](https://github.com/mymonad/mymonad/issues)

[Read contributing guide →](/docs/contributing/)
```

**Step 2: Build and verify**

Run:
```bash
hugo --gc --minify
ls public/roadmap/index.html
```

Expected: File exists

**Step 3: Commit**

```bash
git add content/roadmap.md
git commit -m "[Feat][Content] Add roadmap page with project status and plans"
```

---

## Phase 8: Final Polish

### Task 13: Add Fonts and Final Touches

**Files:**
- Modify: `layouts/partials/head.html`
- Create: `static/images/.gitkeep`
- Create: `.htmltest.yml`

**Step 1: Add Google Fonts to head**

Update `layouts/partials/head.html` to add font imports at the top:

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">

<title>{{ if .IsHome }}{{ site.Title }}{{ else }}{{ .Title }} | {{ site.Title }}{{ end }}</title>
<meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ site.Params.description }}{{ end }}">
<link rel="canonical" href="{{ .Permalink }}">

<!-- Open Graph -->
<meta property="og:title" content="{{ .Title }}">
<meta property="og:description" content="{{ with .Description }}{{ . }}{{ else }}{{ site.Params.description }}{{ end }}">
<meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}">
<meta property="og:url" content="{{ .Permalink }}">

<!-- Structured Data -->
{{- partial "jsonld.html" . -}}

<!-- Styles -->
<link rel="stylesheet" href="{{ "css/main.css" | relURL }}">
```

**Step 2: Create images directory**

```bash
mkdir -p static/images
touch static/images/.gitkeep
```

**Step 3: Create htmltest config**

Create `.htmltest.yml`:

```yaml
DirectoryPath: "public"
CheckExternal: false
CheckInternal: true
EnforceHTTPS: false
IgnoreURLs:
  - "https://fonts.googleapis.com"
  - "https://fonts.gstatic.com"
  - "https://github.com"
  - "https://golang.org"
  - "https://ollama.ai"
```

**Step 4: Build and run full test**

Run:
```bash
hugo --gc --minify
```

Expected: Build succeeds

**Step 5: Commit**

```bash
git add layouts/partials/head.html static/images/.gitkeep .htmltest.yml
git commit -m "[Feat][Style] Add Google Fonts and htmltest configuration"
```

---

### Task 14: Create README and Finalize

**Files:**
- Create: `README.md` (overwrite existing)

**Step 1: Create project README**

Overwrite `README.md`:

```markdown
# mymonad.net

Website for the [MyMonad](https://github.com/mymonad/mymonad) privacy-preserving P2P compatibility protocol.

## Quick Start

```bash
# Install Hugo (https://gohugo.io/installation/)
# Then:

# Development server
make serve

# Build for production
make build
```

## Structure

```
content/           # Markdown content
├── _index.md      # Home page
├── manifesto.md   # Philosophy
├── how-it-works.md
├── get-started.md
├── use-cases.md
├── roadmap.md
├── skill.md       # AI agent guide
├── blog/          # Blog posts
└── docs/          # Documentation

layouts/           # Hugo templates
static/css/        # Stylesheets
```

## Testing

```bash
# HTML validation (requires html5validator)
make test-html

# Link checking (requires htmltest)
make test-links

# All tests
make test
```

## Deployment

The site builds to `public/`. Deploy to any static hosting:

- GitHub Pages
- Netlify
- Cloudflare Pages
- Vercel

## License

MIT
```

**Step 2: Final build and verify**

Run:
```bash
hugo --gc --minify
ls -la public/
```

Expected: All pages generated

**Step 3: Commit**

```bash
git add README.md
git commit -m "[Feat][Docs] Add project README"
```

---

## Summary

This plan creates a complete Hugo website with:

1. **Foundation** - Hugo project, testing infrastructure, base templates
2. **Styling** - CSS with design tokens, dark mode, responsive layout
3. **Content** - Manifesto, How It Works, Get Started, Use Cases
4. **Documentation** - Overview, Protocol, Installation, CLI Reference
5. **Bot Support** - skill.md for AI agents, JSON-LD structured data
6. **Blog** - Blog section with first post
7. **Roadmap** - Project status and future plans
8. **Polish** - Fonts, final configuration, README

Each task is small (2-5 minutes), follows TDD where applicable, and commits incrementally.
