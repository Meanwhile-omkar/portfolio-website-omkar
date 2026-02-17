# Omkar Haryan — Portfolio Website

**The Knight's Gambit** — A chess-themed portfolio showcasing the intersection of Data Science and Strategic Consulting.

## 🎯 Features

- **Minimal Hero Page** - Clean introduction with dual domains (Tech + Strategy)
- **Floating Bottom Navbar** - Icon-based navigation with smooth scroll
- **Case Studies** - Accordion-style expandable cards with competition details
- **Projects & Hackathons** - Modal-based detailed project views
- **Achievements** - Dedicated winnings and leadership section
- **Gallery** - Horizontal scroll film-roll style photo gallery (placeholder for images)
- **Chess Theme** - Knight metaphor with gold accents and elegant typography

## 🛠 Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: CSS animations + Framer Motion (if needed)
- **Fonts**: Playfair Display (serif), DM Mono, DM Sans

## 🚀 Getting Started

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
portfolio-nextjs/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page assembling all sections
│   └── globals.css         # Global styles and chess theme
├── components/
│   ├── sections/
│   │   ├── Hero.tsx        # Hero section
│   │   ├── About.tsx       # Philosophy and stats
│   │   ├── Worlds.tsx      # Tech vs Strategy domains
│   │   ├── CaseStudies.tsx # Accordion case competitions
│   │   ├── Projects.tsx    # Modal-based projects
│   │   ├── Winnings.tsx    # Achievements and leadership
│   │   ├── Gallery.tsx     # Photo gallery (horizontal scroll)
│   │   └── Contact.tsx     # Contact section
│   └── ui/
│       └── BottomNav.tsx   # Floating bottom navigation
└── public/                 # Static assets (add your images here)
```

## 🖼️ Adding Gallery Photos

1. Add your images to the `public/gallery/` directory
2. Update the `galleryPhotos` array in `components/sections/Gallery.tsx`
3. Replace placeholder divs with `<Image>` components from Next.js

Example:
```tsx
import Image from 'next/image';

// In the gallery map:
<Image
  src="/gallery/your-photo.jpg"
  alt={photo.caption}
  fill
  className="object-cover"
/>
```

## 🎨 Customization

### Colors (tailwind.config.ts)
- Gold: `#C9A84C`
- Tech Blue: `#4a9eff`
- Background: `#080808`
- Surface: `#161616`

### Content
Update the data arrays in each section component:
- `components/sections/CaseStudies.tsx` - `cases` array
- `components/sections/Projects.tsx` - `projects` array
- `components/sections/Winnings.tsx` - `achievements` array

## 📝 Build for Production

```bash
npm run build
npm start
```

## 📧 Contact

- **Email**: omkar.djsce27@gmail.com
- **LinkedIn**: [omkar-haryan](https://www.linkedin.com/in/omkar-haryan)
- **GitHub**: [Meanwhile-omkar](https://github.com/Meanwhile-omkar)

---

*"The knight doesn't move like anyone else."* ♞
