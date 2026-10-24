# Omkar Haryan · portfolio

A portfolio drawn like a sketchbook:
- **The Experience Club:** knock on the door, then walk through each internship.
- **The Library:** books for projects, vinyl records for case competitions.
- Simple, hand-drawn sections for everything else.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

## Stack

| Package | Used for |
|---|---|
| Next.js 16, React 19, TypeScript, Tailwind 3 | the site itself |
| framer-motion | animation |
| lenis | smooth scroll |
| roughjs | hand-drawn shapes and hatching |
| rough-notation | marker circles and highlights |
| perfect-freehand | marker arrows |
| simple-icons | tool logos |

## Where things are

- `data/`: all content. See `CONTENT_GUIDE.md`.
- `components/sketch/`: the drawing kit (rough shapes, doodles, arrows, tape, polaroids, stickers).
- `components/experience/`: the door, the full-screen club, scenes and notes.
- `components/library/`: the shelf, books, records and the windows they open into.
- `components/sections/`: hero, about, wins, toolbox, education, hobbies, contact.
- `ASSET_PROMPTS.md`: the images to generate (character, backgrounds) and where they go.
- `PRODUCT.md`: who the site is for and the rules for its copy.
- `/lab`: font and drawing-kit specimen page (not indexed).

## Visual checks

```bash
node scripts/shot.mjs http://localhost:3000/ out.png 1440 900 --full
node scripts/flow-club.mjs http://localhost:3000 <outDir> 1440 900
node scripts/flow-library.mjs http://localhost:3000 <outDir>
```
