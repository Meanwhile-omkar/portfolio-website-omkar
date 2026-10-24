# Editing the content

All text and numbers live in `data/`. You never need to touch the components to change content.

| What | File |
|---|---|
| Name, intro line, about text, contact links, education, résumé email text | `data/profile.ts` |
| Trinity and S4DS roles and photos | `data/campus.ts` |
| Internships (Experience Club) | `data/experience.ts` |
| Projects (books on the shelf) | `data/projects.ts` |
| Case competitions (records) | `data/caseStudies.ts` |
| Awards | `data/achievements.ts` |
| Toolbox stickers | `data/skills.ts` |
| Photo strips (wins, campus, hobbies) | `scripts/photo-sort.json`, then run `python scripts/photos.py` |

## Writing rules

- Use plain, short sentences. Say what the company does, what you did, and what came out of it.
- Use only real numbers. Write "projected" for anything you estimated, as opposed to measured.
- Leave out filler words like "leveraged", "spearheaded", "passionate", "seamless" and "journey".

## Things the site handles for you

- **Wins numbers:** counted from `achievements.ts` and `caseStudies.ts`, so they stay correct when you add a row.
- **"What I liked most" bubble:** in the Experience Club, it only appears once you set `likedMost` for that company.
- **Shelf rows:** `shelf: "built" | "hackathon"` decides which shelf a book sits on.
  - `spine.width` and `spine.height` change the book's size.
  - `spine.icon` picks a doodle. The full list is on `/lab`.
- **Placeholder art:** while an image path is `null`, the site draws a sketched placeholder instead.

## Images

See `ASSET_PROMPTS.md` for what to generate and where to put it.

## Fonts and primitives

Open `/lab` while the dev server is running. It shows the hand-font options and every sketch element side by side.

## Photos (wins, campus, hobbies)

1. Put the photo in `assets-src/photos/` (any size, JPG or PNG).
2. Add its file name to the right list in `scripts/photo-sort.json`. Order in the list is the order in the strip.
3. Run `python scripts/photos.py`. It makes a small strip version and a large click-to-open version of every photo, skips near-duplicates, and updates `data/photos.json`.

Photos show at their own shape, uncropped, with no captions.
