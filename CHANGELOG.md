# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] - 2026-10-02

### Changed

- Loop 4 surgical: explorer ellipsis (1-line truncate .explorer a/folder-title overflow hidden ellipsis nowrap), top spacing 6rem→2.5rem ($topSpacing), graph off + TOC prio 10, networking flatten 10 bundles flat + aliases Title-Case.
- Dark Primary 8-token already at parity (#2e261f/#26211c/#6b563d/#ab916d/#d7c0a3/#e5aa1f/#108454/rgba 229,170,31,0.15/#ffbb0033) verified 0 stock.

### Proof

- npx quartz build EXIT 0 189 parsed / 422 emitted (sitemap 190 locs, 11 networking), grep Schibsted 0, titles Title-Case, slugifyFilePath lowercase.

## [0.3.1] - 2026-10-02

### Changed

- Loop 3 surgical: explorer folders toggle in place (folder-page off); dark Primary palette port (stock 161618 removed); 69 callouts typed (blue fallback gone).
- Quartz 5 rebuild on Primary 2.10.0 @728px (Paper #f9f3ec, Inter/IBM Plex Mono, KaTeX 1.2em) — 188 notes (177 vault + 10 networking + index), sitemap absolute, deploy node22→ci→install-plugins→build→upload public.

### Fixed

- Loop 2 surgical: dual-font dedupe (Inter single href), canonical Hardware/hardware dedupe, remove dead weight [redacted] 207+content/docs 191, hard line breaks in callouts, Networking Title-Case.

## [0.3.0] - 2026-06-07

### Added

- Obsidian-inspired dark theme with subtle heading sizing.
- Callout support via Hugo shortcodes, including bare callouts, nesting, lists, and tables.
- Obsidian syntax transformation pipeline for Hextra compatibility.
- Closing unclosed code blocks in affected notes.

### Fixed

- Blockquotes inside callouts no longer forced to italic.
- `h2` tags no longer wrap callout `div` containers.
- Opacity override that was hiding subheading-anchor elements.
- Table and heading CSS for consistent rendering.

### Changed

- Standardized layout overrides and workflows to align with MLN project.
- Updated `.gitignore` patterns for vault metadata.

## [0.2.0] - 2026-06-05

### Added

- Miscellaneous and Random vault notes section (210 additional pages), expanding total to 387.
- RSS feed, custom 404 page, and automated broken-link detection.
- README with repository structure and quick-start guide.

### Fixed

- KaTeX math rendering: added auto-render initialization call, asset configuration for JS loading, and missing `hashlib` import.
- Converted `\( \)` / `\[ \]` delimiters to dollar-sign math for Goldmark passthrough compatibility.
- Normalized block math with blank-line separators.
- Slugified non-ASCII titles using hash-based fallback.

### Changed

- Switched from server-side to client-side KaTeX rendering for faster page loads.
- Homepage card layout: removed section cards, dynamic column counts, 4-col and 2-col responsive grids.
- Slugified folder names and section card links to fix 404 errors on non-ASCII paths.
- Renamed site to "CS Notes" and updated misc section subtitle.
- Removed vault metadata from tracking (`[redacted]`, PNG artifacts, duplicate metadata).
- Cleaned up repository: deleted Hugo-Half-Failed-Implementation directory and 117 stale agent workflow files.

### Optimized

- Removed section cards for faster page loads.
- Added RSS feed, 404 page, and broken-link detection tooling.

## [0.1.0] - 2026-06-05

### Added

- Initial CS-Notes vault publication with Hugo static site generator and Hextra theme.
- 177 computer science study notes covering algorithms, data structures, and related topics.
- Base Hugo + Hextra site infrastructure: submodule initialization, GitHub Pages deployment configuration, and base URL setup.
- Core site navigation and content organization.
