# Certification Roadmap

Interactive map of cybersecurity and IT certifications. Explore certifications by
domain and seniority, build your own path from a single certification, and
evaluate the strengths of your certification profile — all in the browser, with
no sign-up and no backend.

Inspired by the well-known security certification roadmaps, reimagined as an
interactive, colour-by-domain tool.

## Features

- **Map** — a grid of certifications organised by domain (columns) and seniority
  (rows), colour-coded per domain.
- **Tracks** — curated learning paths (SOC/Blue Team, Red Team, GRC, Cloud,
  AppSec, Leadership), each ordered from the first step to the most advanced.
- **Build your path** — pick an anchor certification; the tool explains what it
  is and suggests the certifications that logically come next.
- **Evaluate your profile** — check the certifications you hold and get a
  per-domain strengths breakdown, an estimated seniority and a written summary.

## Tech stack

React + TypeScript + Vite + Tailwind CSS. Everything runs client-side; the
certification catalogue lives in `src/data/`.

```
src/
  data/           # domains, levels, certifications and curated tracks
  lib/            # recommendation engine, profile evaluation, styling helpers
  components/     # UI panels and shared primitives
```

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run lint     # lint
```

## Deploy

Ships to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) on
every push to `main`. The Vite `base` is set to `/Certification-Roadmap/` (the
GitHub Pages path is case-sensitive); keep it in sync with the repository name.

## Disclaimer

This is an educational, vendor-neutral reference. It is not affiliated with or
endorsed by any certification body. Certification names and requirements change —
always confirm details on each certification's official page.
