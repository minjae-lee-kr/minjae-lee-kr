# Maintaining the local portfolio

The hub is buildless HTML, CSS and JavaScript. It has no runtime dependencies. Node.js 22 or newer is sufficient to preview the committed reports and run the checks:

```sh
node scripts/serve.mjs
node --test
```

The preview captures bytes from `docs/` when it starts and does not reopen file paths for requests. Restart it after any content edit, not only when adding routes. A later directory replacement cannot redirect a request to another file. The local tree is trusted during startup capture; the preview is not a filesystem sandbox. It exposes no experiment API and accepts no mutation requests. The report pages are recorded local runs, not running backends.

## Language

The hub and bundled displays share the `minjae.portfolio.language` localStorage preference. A Korean browser starts in Korean unless an explicit preference exists. Storage access is optional and guarded; the language buttons still work when storage is blocked. Switching language preserves the report's selected case and expanded evidence. The `pageshow` handler refreshes the preference on Back/Forward restoration without resetting the in-memory selection; a browser that reloads the page instead may reset that selection.

## Interactive illustrations and visual assets

The home page's `workbench.js` is an explanatory model, not an experiment runner. Its three scenes make no requests and preserve their selection, receipt state, compiler policy and timeline position across language switches. Links lead to separately identified frozen recordings. Keep the labels explicit when changing the presentation; a local animation is not new measured evidence.

The tabs support arrow keys, Home and End. The timeline uses a native range input, and motion respects `prefers-reduced-motion`. Review keyboard focus, narrow screens, language changes and browser Back after editing interactions. Do not trade readable results or ordinary navigation for decorative motion.

The three panels share a CSS grid cell so an inactive scene still reserves its layout size. Hidden panels also use `visibility: hidden` and `inert`; they must never appear in the accessibility tree or keyboard order. Keep outcome blocks tall enough for both states in each language. Controls sit beside their results, and state transitions use 160 ms without moving the document. Anchor navigation uses ordinary browser scrolling, with the top anchor on the body so returning home includes the header.

SUIT Variable is self-hosted under `docs/assets/fonts/`; its original source and SIL Open Font License accompany the unmodified font. Social images are original vector compositions and PNG exports in `docs/assets/social/`. No third-party font or analytics request is needed to read the site.

## Refreshing evidence

The bilingual reading pages under `docs/notes/` link to these frozen recordings. Their source revisions, figures and claims are historical, even when the experiment repositories advance. Refresh a note's evidence and explanation together; do not silently relabel a past recording as a new run. The notes share the language preference, preserve open source details and keep the reader within the same section when a translation changes the page height.

`node scripts/bundle-evidence.mjs` is a maintainer-only import from the three known sibling project directories. It is not required for a checkout to render or pass its existing bundle checks. The source revisions, report directories and optional exact recording digests are pinned in that script. A single bundle can be refreshed with `intent`, `change` or `cancellation` as its sole argument.

Before changing a pin, confirm the source checkout and its recorded run belong together. The import rejects dirty or changed source metadata, incomplete expected case/check inventories and failed observations. Verified Change assets must match the recorded source fingerprint. Cancellation Debt's export manifest must match every original export file. These checks inspect a known report contract; they do not rerun or independently prove the underlying experiment.

Raw evidence JSON stays byte-for-byte unchanged. Cancellation's embedded `report-data.js` and original `export.json` also remain unchanged. Only display assets receive relative links, the shared language preference and a recorded-run banner. Each bundle's `recording.json` hashes the resulting display files and identifies these adaptations. The original Cancellation export manifest therefore describes its original assets; `recording.json` describes the adapted assets here. Hashes aid reproduction and accidental-change detection, not attestation against a local writer.

Do not format bundled files after import. Update source copy or the bundler, regenerate, then run `node --test`. The tests exercise the read-only HTTP preview, relative assets, byte-preservation manifests and rejection of truncated evidence. Browser review is still needed for layout, keyboard use and actual preference restoration.

## Scope and publication

The three reports use synthetic fixtures and real local I/O. Their source repositories are public under `github.com/minjae-lee-kr`. The portfolio is public at `https://minjae-lee-engineering-labs.crisp-cream-0381.chatgpt.site/`. Add or change publication links only after their destinations exist. Hosting configuration belongs to the separate deployment checkout, not this source hub.

No employer implementation, private career records, absolute local paths or credentials belong in this repository. The importer checks common path and credential markers; that scan is a guard against accidental inclusion, not a complete privacy or security audit.
