# cs-notes 404 fix — evidence (2026-10-02)

Site: https://icemedica341.github.io/cs-notes/ · Repo: icemedica341/cs-notes · Branch: main

## Root causes (verified in repo + clean build)
1. **Slug case mismatch (the folder 404s):** Quartz `slugifyPath` lowercases every
   segment (`.toLowerCase()` in `@quartz-community/utils/dist/path.js`). Source dirs
   `content/Hardware|Math|Software` therefore serve at `/hardware|math|software/`,
   but `content/index.md` linked `./Hardware/`, `./Math/`, `./Software/` (capitals).
   GitHub Pages (Linux) is case-sensitive → 404 on every folder link.
2. **Stale `public/` (gitignored, never cleaned):** previous commit `adde633` fixed
   `baseUrl` → `icemedica341.github.io/cs-notes` + footer to `icemedica341/cs-notes`,
   but the checked-out `public/` was built before that — footer still pointed at
   `icemedica341/cs-notes`, and it contained pre-lowercase `Hardware/*/…` leaf pages
   with no `index.html`. `npx quartz build` does not delete stale files on its own.
3. **Self-alias on networking folder:** `content/networking/index.md` had
   `aliases: ["networking"]`, identical to its own simplified slug (`networking/index`
   → `networking`). `alias-redirects` emitted a stray root `public/networking.html`
   meta-refresh alongside the real `public/networking/index.html`.
4. **Repo links pointed at the wrong repo:** `package.json` `homepage` +
   `repository.url` and `README.md` site URL still said `icemedica341/cs-notes`.
   `quartz.config.yaml` `baseUrl` + footer were already correct (verified, no change).
5. **SPA/basePath:** `enableSPA: true` is fine on a project subpath — Quartz emits
   relative asset/link URLs (`./hardware/`, `./index-*.css`, `pathToRoot`-based),
   so no `basePath` change needed. Verified in built `public/index.html`.

## Fixes applied (4 files, minimal surgery)
- `content/index.md` — section links lowercased to `./hardware/`, `./math/`,
  `./software/`, `./networking/` (labels/display titles unchanged).
- `content/networking/index.md` — removed `aliases: ["networking"]` self-alias.
- `package.json` — `homepage` → `https://icemedica341.github.io/cs-notes`,
  `repository.url` → `https://github.com/icemedica341/cs-notes.git`.
- `README.md` — site URL → `https://icemedica341.github.io/cs-notes/`, Hugo/Hextra
  references → Quartz (`npx quartz build --serve` / `npx quartz build`).
- `quartz.config.yaml` — verified already correct (`baseUrl:
  icemedica341.github.io/cs-notes`, footer `GitHub: https://github.com/icemedica341/cs-notes`);
  no edit needed.

## Rebuild (clean, from deleted `public/`)
- `public/` is gitignored + untracked (`git ls-files public` → 0 files), so delete
  + rebuild is safe and does not touch history.
- `npx quartz build` output: `Found 189 input files`, `Parsed 189 Markdown files`,
  `Emitted 438 files to public`.
- Post-build verification (all pass):
  - `public/hardware|math|software|networking/index.html` + `public/index.html` exist.
  - `public/index.html` section links: `./hardware/`, `./math/`, `./software/`,
    `./networking/` (all lowercase, trailing slash).
  - Footer repo link: `https://github.com/icemedica341/cs-notes` (was `icemedica341`).
  - `public/networking.html` no longer emitted (self-alias gone);
    `/networking` resolves via Pages folder-index redirect → `/networking/`.
  - `public/Hardware|Math|Software` still present BUT each file is a
    `alias-redirects` case-redirect stub (`canonical` + `meta refresh` → lowercase).
    This is default `enableCaseRedirects: true` behavior and is desirable: old
    capital URLs redirect instead of 404ing. Not stale content — verified by reading
    a stub (`<title>hardware/…</title>`, `noindex`, refresh to `../../hardware/…`).

## Deploy
- Commit on `main` as icemedica341 (signed, matching prior dev commit `adde633` and the
  `icemedica341/cs-notes` remote; content history remains icemedica341).
- Push `main` → GitHub Actions `Deploy Quartz site to GitHub Pages`
  (`npx quartz build` + `upload-pages-artifact path: public`) → `deploy-pages`.
- No tags/releases created (Pages deploys from branch, per request).

## Residual / non-issues
- `catalog-info.yaml` `owner: icemedica341` left untouched (Backstage metadata,
  not Pages routing).
- KaTeX warnings during build (`U+8239 narrow no-break space`, `\\` in display
  mode) are `strict: warn` only — pages still emit. Separate cleanup if desired.

## Live verification (2026-10-02, post-deploy run 36958978106 success)
- Actions: `Deploy Quartz site to GitHub Pages` run 36958978106 → conclusion
  `success` (build 37s + deploy 12s, 54s total). Pages status: `built`,
  `html_url: https://icemedica341.github.io/cs-notes/`.
- `curl` on live site (all `200`): `/`, `/hardware/`, `/math/`, `/software/`,
  `/networking/`, `/hardware/binary-operations/`, `/tags/`.
- Capital folder roots (`/Hardware/`, `/Math/`, `/Software/`) return `404` —
  expected: canonical URLs are lowercase, all internal links/explorer emit
  lowercase, and `alias-redirects` only stubs leaf pages (not folder roots).
  No in-site link points at capitals anymore.
- No tags/releases created (`git tag --list` empty for this line).
