# 📝 Content Management Guide

Your portfolio is now **super easy to update**! Just edit data files and add images. No complex code needed.

---

## 🎯 Quick Start

### Adding Content = 3 Simple Steps

1. **Edit the data file** in `data/` folder
2. **Add images** to the matching `public/` folder
3. **Refresh the page** - done! ✨

---

## 📁 File Structure

```
portfolio-nextjs/
├── data/                          # ← EDIT THESE TO ADD CONTENT
│   ├── caseStudies.ts             # Case study competitions
│   ├── internships.ts             # Work experience
│   ├── projects.ts                # Your projects
│   └── achievements.ts            # Wins & leadership
│
└── public/                        # ← ADD IMAGES HERE
    ├── gallery/                   # Personal photos
    ├── case-studies/
    │   ├── spotify/               # Spotify case images
    │   ├── ies-retail/            # IES case images
    │   ├── iim-ahmedabad/         # IIM case images
    │   └── iit-bombay/            # IIT case images
    ├── internships/
    │   ├── cyphersol/             # CypherSOL internship
    │   ├── bigul/                 # Bigul internship
    │   └── sereno-volante/        # Sereno Volante internship
    ├── projects/
    │   ├── lawzyai/               # LawzyAI screenshots
    │   └── ml-quest/              # ML Quest project
    └── achievements/              # Award photos
```

---

## 1️⃣ Adding a New Case Study

### Step 1: Edit `data/caseStudies.ts`

Open the file and copy this template at the end of the array:

```typescript
{
  id: 5,  // Increment from last id
  rank: '#1',  // or '#2', 'Finalist', etc.
  title: 'Your Competition Name',
  meta: 'College Name · Month Year',
  badge: '🏆 Winner',  // or '🥈 Runner-Up', '✨ Recognized'
  badgeStyle: 'win',  // or 'runner-up', 'finalist'
  problem: 'What problem did you solve?',
  solution: 'What was your approach?',
  impact: 'What was the outcome?',
  pptLink: 'https://your-presentation-link.com',  // optional
  imageFolder: 'your-case-folder',  // lowercase, use hyphens
},
```

### Step 2: Add Images

1. Create folder: `public/case-studies/your-case-folder/`
2. Add 2-4 images (presentation slides, photos):
   - `slide-1.jpg`
   - `slide-2.jpg`
   - `presenting.jpg`
   - `team.jpg`

**That's it!** Your case study will appear automatically with all images.

---

## 2️⃣ Adding a New Internship

### Step 1: Edit `data/internships.ts`

Copy this template:

```typescript
{
  id: 4,  // Increment from last id
  company: 'Company Name',
  role: 'Your Role',
  duration: 'Month Year – Month Year',
  location: 'City, Country',
  type: 'remote',  // or 'on-site', 'hybrid'
  description: 'What does the company do?',
  responsibilities: [
    'Key responsibility 1',
    'Key responsibility 2',
    'Key responsibility 3',
  ],
  impact: 'What impact did you make? (with numbers if possible)',
  skills: ['Skill1', 'Skill2', 'Skill3', 'Skill4'],
  imageFolder: 'company-name-lowercase',
},
```

### Step 2: Add Images

1. Create folder: `public/internships/company-name-lowercase/`
2. Add photos:
   - `office.jpg`
   - `team.jpg`
   - `project-screenshot.jpg`
   - `certificate.jpg`

Done! Internship appears with images in modal when clicked.

---

## 3️⃣ Adding a New Project

### Step 1: Edit `data/projects.ts`

Copy this template:

```typescript
{
  id: 3,  // Increment from last id
  type: 'Technical',  // or 'Hackathon', 'Product', 'Research'
  typeColor: 'tech',  // or 'hack', 'strategy', 'research'
  name: 'Project Name',
  subtitle: 'Short tagline',
  desc: 'One-line description for card',
  stack: ['Tech1', 'Tech2', 'Tech3'],
  fullDesc: 'Detailed description (2-3 sentences) - shows in modal',
  impact: 'What was the outcome/impact?',
  links: {
    demo: 'https://demo-link.com',  // optional
    website: 'https://website.com',  // optional
    github: 'https://github.com/your-repo',  // optional
  },
  imageFolder: 'project-name-lowercase',
},
```

### Step 2: Add Screenshots

1. Create folder: `public/projects/project-name-lowercase/`
2. Add screenshots:
   - `screenshot-1.png`
   - `screenshot-2.png`
   - `architecture.png`

Project card appears, click it for full modal with images!

---

## 4️⃣ Adding Achievements

### Step 1: Edit `data/achievements.ts`

#### For Competition Wins:

```typescript
// Add to achievements array:
{
  trophy: '🏆',  // or '🥈', '🥉', '🏅', '✨'
  title: 'Achievement Title',
  org: 'Organization/Event Name',
  year: '2026',
},
```

#### For Leadership Positions:

```typescript
// Add to leadership array:
{
  icon: '👑',  // any emoji
  role: 'Your Position',
  org: 'Organization Name',
  duration: 'Month Year – Present',
  description: 'What you do in this role',
},
```

### Step 2: Add Award Photos (Optional)

Add certificate/award photos to `public/achievements/`

---

## 5️⃣ Adding Gallery Photos

**Super simple!** Just add photos to `public/gallery/`

- Any image format: `.jpg`, `.png`, `.webp`
- Any number of photos
- They automatically appear in horizontal scroll

**Naming tip:** Use descriptive names:
- `speaking-jan2026.jpg`
- `winning-analytrix.jpg`
- `team-hackathon-aug2025.jpg`

The system shows the filename as caption (with hyphens replaced by spaces).

---

## ✨ Dynamic Features

### Auto-Detection

- **Images auto-load**: Just drop images in folders, they appear automatically
- **Show what exists**: If folder is empty, section shows "No images yet"
- **Flexible counts**: Add 1 image or 10 images, both work perfectly

### Easy Editing

- **No HTML/CSS needed**: Edit plain text in data files
- **Copy-paste templates**: Use the templates above
- **Hot reload**: Changes appear instantly in dev mode

---

## 🎨 Image Guidelines

### Best Practices

- **Format**: JPG or PNG (WebP for smaller size)
- **Size**: Max 2MB per image for fast loading
- **Dimensions**:
  - Gallery: 1200x800px or larger
  - Projects: 1920x1080px (full screenshots)
  - Case studies: 1280x720px (slide exports)

### Quick Edit Tips

- Crop to remove unnecessary parts
- Compress with tools like TinyPNG
- Use descriptive filenames

---

## 🚀 Deployment

When ready to deploy:

```bash
npm run build
```

Then deploy to Vercel:
1. Push to GitHub
2. Import on vercel.com
3. Auto-deploys on every push!

---

## ❓ Need Help?

### Common Issues

**Q: Images not showing?**
- Check filename extensions (.jpg, .png)
- Ensure folder name matches `imageFolder` in data file
- Check console for errors (F12 in browser)

**Q: Content not updating?**
- Restart dev server: `Ctrl+C` then `npm run dev`
- Clear browser cache
- Check for TypeScript errors in terminal

**Q: How to delete content?**
- Remove the entry from data file
- Delete the image folder (optional)

---

## 🎯 Pro Tips

1. **Batch add**: Copy template multiple times, fill all at once
2. **Test locally**: Always check on localhost before deploying
3. **Use real links**: Add actual PPT links, GitHub repos, demo URLs
4. **Keep backups**: Commit to git regularly
5. **Optimize images**: Use [TinyPNG](https://tinypng.com) before uploading

---

**You're all set!** 🎉

Just edit data files and add images. That's all you need to keep your portfolio fresh and updated.
