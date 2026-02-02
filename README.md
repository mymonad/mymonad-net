# mymonad.net

The official website for MyMonad - a local-first, privacy-preserving social discovery protocol.

## Quick Start

```bash
# Start development server
make serve

# Build for production
make build
```

The development server runs at `http://localhost:1313` with live reload.

## Structure

```
mymonad-net/
├── content/           # Markdown content pages
│   ├── _index.md      # Homepage
│   ├── manifesto.md   # Philosophy
│   ├── how-it-works.md
│   ├── get-started.md
│   ├── use-cases.md
│   └── roadmap.md
├── layouts/           # Hugo templates
│   ├── _default/      # Base templates
│   ├── partials/      # Reusable components
│   └── index.html     # Homepage template
├── static/            # Static assets
│   ├── css/           # Stylesheets
│   └── images/        # Images
├── archetypes/        # Content templates
└── docs/              # Project documentation
```

## Testing

```bash
# Run all tests
make test

# Validate HTML structure
make test-html

# Check for broken links
make test-links
```

## Deployment

The site builds to the `public/` directory. Deploy to any static hosting:

### GitHub Pages

1. Build the site: `make build`
2. Push `public/` to `gh-pages` branch

### Netlify

1. Connect repository
2. Build command: `hugo --gc --minify`
3. Publish directory: `public`

### Vercel

1. Import repository
2. Framework preset: Hugo
3. Build command: `hugo --gc --minify`

### Self-hosted

1. Build: `make build`
2. Serve `public/` with nginx, Apache, or any static server

## Development

Requirements:
- Hugo (extended version recommended)
- Make

Clean build artifacts:
```bash
make clean
```

## License

MIT
