# CS Notes

Computer science notes — math, hardware, networking, and systems engineering — built as a static site with [Quartz](https://quartz.jzhao.xyz/).

**Site:** https://icemedica341.github.io/cs-notes/

> [!NOTE]
> This project is paused. I stopped writing new notes because maintaining them cost more study time than they gave back. They stay published as a snapshot of how I actually learned CS — building them was a mind-opening way to study, even if I wouldn't do it this way again.
> [!NOTE]
> These are my personal study notes — my understanding at the time, not a textbook. Some of it has mistakes; use at your own discretion.

## Quick start

```sh
npm ci
npm run install-plugins
npx quartz build --serve
```

`install-plugins` links local `quartz-plugins/` into the build (also runs automatically as `prebuild`).

## Structure

| Path                 | What                                                  |
| -------------------- | ----------------------------------------------------- |
| `content/`           | Markdown source (174 notes)                           |
| `quartz.config.yaml` | Site config (title, baseUrl, theme, plugin list)      |
| `quartz/`            | Quartz SSG core (bootstrap CLI, layouts, components)  |
| `quartz-plugins/`    | Local plugins (explorer sort + locate, see `loader/`) |
| `public/`            | Build output (gitignored, deployed via GitHub Actions) |

## Build

```sh
npx quartz build
```

Output goes to `public/` — auto-deployed via GitHub Actions on push to `main` (`npm ci` → `npm run install-plugins` → `npx quartz build`).

174 source notes emit 198 sitemap URLs (174 notes + 23 section indexes + tags index).

## License

The notes and site content are provided for reference.
