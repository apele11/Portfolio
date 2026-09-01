# Restoring the Pink Ahead project document

The Pink Ahead Firestore document was **deleted on 2026-09-01** because the
campaign photography in its case study had not been cleared by the creative
department, and the live page at `/projects/1788024781837` was republishing that
imagery. See the comment block at the top of
`src/projects/layouts/PinkAheadLayout.tsx`.

Nothing else was removed. `PinkAheadLayout.tsx` and its `layoutRegistry` entry in
`src/data/registry.ts` are still in the repo, so recreating the document below is
the only step needed to bring the whole case study back.

Its `order` was 4, and that slot was deliberately left empty rather than
renumbering the other projects, so a restore drops it back into its original
position in the grid.

## Restore

Requires `gcloud` authenticated as the project owner (`gcloud auth list`).
Run from the repo root:

```bash
TOKEN=$(gcloud auth print-access-token) && curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" "https://firestore.googleapis.com/v1/projects/portfolio-cf811/databases/(default)/documents/projects/1788024781837" -d @docs/pink-ahead-project.json
```

Then regenerate the committed snapshot and sitemap:

```bash
npm run snapshot
```

The document can also be recreated by hand through the dev-only admin panel
(press Escape on the home page), but the id would differ, which would break the
`/projects/1788024781837` URL. Use the command above to keep the original id.

## What was in it

| Field | Value |
| --- | --- |
| header | Pink Ahead |
| subtitle | Website for breast cancer awareness nonprofit, Pink Ahead. |
| eyebrow | Nonprofit Site, Front End |
| order | 4 |
| date | July 2026 - Aug 2026 |
| type | Group |
| role | Frontend Developer |
| skills | React, TypeScript |
| coverUrl | /assets/compressed/PinkAhead/PinkAhead-cover.webp |
| colors | #ec08bc, #ffcce9, #fb79d8, #ffd6f0 |
| scrimStrength / scrimWidth | 0.72 / 0.6 |

The full payload, in Firestore REST format, is in
[`pink-ahead-project.json`](pink-ahead-project.json) next to this file.
