# Images to generate

These are the images the site needs from you. Generate them with ChatGPT image generation or Gemini. Name each file as shown and drop it in the folder listed. Then set the path in the data file. Until you do, the site shows sketched placeholders, so nothing breaks while you work through the list.

---

## A. Your character (done)

All 9 characters are on the site. The originals live in `assets-src/character/`, and the transparent cut-outs the site uses are in `public/character/*.webp`. To swap one, replace its PNG in `assets-src/character/` and run:

```bash
python scripts/cutout.py assets-src/character/<name>.png public/character/<name>.webp
```

The original brief is kept below for reference.

### Original brief (10 images)

**Before you start**
- Use 1–2 clear, front-facing photos of yourself, with good light and nothing covering your face.
- Upload your photo **every time** you generate an image.
- Make the **master** image first. For every image after it, upload the master **and** your photo, and paste the variation prompt.
- If the background comes out as plain white instead of transparent, that's fine. Send the images as they are and I'll cut the backgrounds out.

### Master prompt (image 1, the hero)

> Create a high-quality 3D animated character in the style of a Pixar / Disney feature film, based on the person in the attached photo: keep his exact face shape, eyes, nose, eyebrows, hairstyle, skin tone and facial hair so he is clearly recognisable. Young Indian man, early 20s, friendly confident look. Full body, head to toe fully visible including shoes, standing, camera at chest height, straight-on view, 2:3 portrait, at least 2048 px tall. Soft even studio lighting from the front-left, subtle rim light, no harsh shadows. Plain flat pure white background (#FFFFFF), no floor, no props, no shadow on the ground, no text, no watermark. Outfit: brown corduroy-style jacket over a sage-green shirt and blue tee, dark jeans with cuffs, tan leather boots. Pose: relaxed, one hand waving at the viewer, warm smile.

### Variation prompt (images 2–10)

Fill in the outfit, pose and expression from the table below:

> Same character as the attached image, identical face, hair, body proportions, lighting, camera angle, framing and plain white background. Change only the outfit, pose and expression. Outfit: **[outfit]**. Pose: **[pose]**. Expression: **[expression]**. Full body head to toe, 2:3 portrait, no props unless stated, no text.

| # | File → folder | Outfit | Pose | Expression |
|---|---|---|---|---|
| 1 | `hero.png` → `public/character/` | (master) | waving | warm smile |
| 2a | `infiheal.png` → `public/character/` | navy blazer over a white crew-neck tee, dark chinos, white sneakers, a slim laptop bag | holding a pitch deck printout in one hand, presenting with the other | confident, mid-sentence smile |
| 2b | `outcry.png` → `public/character/` | black crew tee, black jacket, a headset around the neck, an event "STAFF" lanyard, black jeans, boots | holding a clipboard, other hand giving a thumbs up | energetic, laughing |
| 2 | `buzz.png` → `public/character/` | black tee, open checked overshirt, black cargo pants, white sneakers, a lanyard with a "CREW" badge | holding a walkie-talkie up near his mouth, other hand pointing forward | excited, big open grin |
| 3 | `iitb-kcdh.png` → `public/character/` | white lab coat over a light blue shirt, ID card on the pocket, grey trousers | holding a tablet showing a close-up of an eye, looking at it | curious, focused, slight head tilt |
| 4 | `sereno-volante.png` → `public/character/` | navy polo, a yellow safety hard hat tucked under one arm, khaki chinos, work boots | holding an open laptop in the other hand | confident half smile |
| 5 | `bigul.png` → `public/character/` | light grey blazer over a white tee, dark jeans, clean sneakers | holding a phone showing a stock chart, other hand on chin | thoughtful, eyebrows slightly raised |
| 6 | `cyphersol.png` → `public/character/` | light blue oxford shirt with rolled sleeves, beige chinos, brown loafers | holding a magnifying glass over a small stack of paper statements | sharp, satisfied smile |
| 7 | `contact.png` → `public/character/` | (master outfit) | about to throw a paper plane | friendly smile |
| 8 | `door.png` → `public/character/` (optional) | (master outfit) | knocking gesture, slight 3/4 view | cheeky smile |

**Then set the paths:**
- `data/profile.ts` → `character.hero` and `character.contact`
- `data/experience.ts` → `character` for each company

---

## B. Doodle backgrounds for the Experience Club (5 images)

### Prompt template

Paste in the theme for each company from the table below:

> A hand-drawn doodle infographic illustration on clean off-white paper (#F7F7F5), drawn like an iPad sketchnote: black marker outlines with slightly wobbly lines, flat fills with hatching and cross-hatch shading, limited palette of yellow #FFC700, sky blue #18A0FB, pink #EE46D3, green #1BC47D, orange #EF5533 used sparingly, lots of white space. Theme: **[theme]**. Composition for a 16:9 website background, 3840×2160: doodles placed loosely around the edges and corners only, small to medium size, about 25% of the area covered. Keep the central vertical band (middle 40% of the width) completely empty, keep the top-right quarter mostly empty, and leave calm space at the middle-left and bottom-right for text. Playful, premium, consistent stroke width. Absolutely no text, letters, numbers, logos or watermark.

| File → folder | Theme to paste in |
|---|---|
| `public/experience/infiheal/bg.png` | health-tech startup and fundraising: a friendly chat bubble with a heart, a brain with a small leaf, a pitch deck on an easel, a rising chart, a rocket, a globe with a few pins, a handshake, a phone showing a calm face |
| `public/experience/outcry/bg.png` | big live events and award shows: a stage with spotlights, a DJ deck, speakers, a trophy, a clipboard with a run-of-show list, light beams, confetti, a red carpet strip, string lights |
| `public/experience/buzz/bg.png` | live events and comedy shows: microphones on stands, stage spotlights, speakers, concert tickets, confetti, a laughing comedy mask, music notes, raised crowd hands, a rap-battle mic with sound waves |
| `public/experience/iitb-kcdh/bg.png` | digital health research: a human eye with visible blood vessels, a microscope, test tubes, a blood drop, a heartbeat line, a petri dish, a small neural-network node diagram, a magnifier over an image |
| `public/experience/sereno-volante/bg.png` | industrial AI: a factory with chimneys, gears, a conveyor belt, steel beams and coils, a robotic arm, chatbot speech bubbles, a CAD blueprint sheet with a ruler, a simple flowchart |
| `public/experience/bigul/bg.png` | stock market and algo trading: candlestick charts, a bull and a bear, a rising arrow, a phone with a chart, coins, an algorithm flowchart with a play button, a magnifying glass |
| `public/experience/cyphersol/bg.png` | fintech and bank-statement analysis: stacked bank statement papers, a bank building, a magnifying glass over table rows, a pie chart, a padlock and shield, category tags, coins |

**Then set the path:** `background` in `data/experience.ts`.

**Check the result:** if the doodles land where the text goes (the left side, the top right, or the bottom right), generate it again. Those spaces need to stay quiet.

---

## C. Real files only you have

- **Company logos:** done for Infiheal, CypherSOL, Bigul, Sereno Volante, IIT Bombay KCDH and Outcry, taken from their websites.
  - Buzz Entertainment still needs one: save it as `public/experience/buzz/logo.png` and set `logo` in `data/experience.ts`.
- **College photo:** `public/photos/college/campus.jpg`, then set `education.photo` in `data/profile.ts`.
- **Hobby photos:** put them in `public/photos/hobbies/`, then list them in `data/gallery.ts` under the right hobby.
- **More competition or conference photos:** put them in `public/photos/wins/`, then add a line to `winsPhotos` in `data/gallery.ts`. They scroll in two rows, so add as many as you like.
- **Trinity and S4DS photos:** put them in `public/photos/campus/`, then add a line to `campusPhotos` in `data/campus.ts`.
