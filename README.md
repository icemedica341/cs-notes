# CS Notes

Computer science notes — math, hardware, networking, and systems engineering — built as a static site with [Quartz](https://quartz.jzhao.xyz/).

**Site:** https://icemedica341.github.io/cs-notes/

## Quick start

```sh
npx quartz build --serve
```

## Structure

| Path                       | What                                        |
| -------------------------- | ------------------------------------------- |
| `content/`                 | Markdown source (174 notes)                 |
| `scripts/[redacted]` | Converts Obsidian vault → Hugo content      |
| `layouts/`                 | Custom render hooks (KaTeX, callouts)       |
| `assets/katex/`            | KaTeX client-side renderer                  |
| `[redacted]/`            | Raw Obsidian vaults (source for conversion) |

## Build

```sh
npx quartz build
```

Output goes to `public/` — auto-deployed via GitHub Actions on push to `main`.

## License

The notes and site content are provided for reference.
