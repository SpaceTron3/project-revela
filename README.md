# Project Revela — Website

A Next.js marketing site for Project Revela, a nonpartisan civic transparency platform.

## Getting started

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Deploy to Vercel (free)
1. Go to [vercel.com](https://vercel.com) and create a free account
2. Click **"Add New Project"**
3. Import your GitHub repo (or drag and drop this folder)
4. Click **Deploy** — your site will be live in ~60 seconds

---

## Project structure

```
project-revela/
├── app/
│   ├── globals.css       # Global styles & animations
│   ├── layout.js         # Root layout & metadata (SEO)
│   └── page.js           # Home page
├── components/
│   ├── Navbar.js         # Top navigation bar
│   └── WaitlistForm.js   # Email capture form
├── public/               # Static assets (add your images here)
├── tailwind.config.js    # Design tokens & colors
└── package.json
```

## Next steps

### Wire up the waitlist form
In `components/WaitlistForm.js`, replace the `handleSubmit` function with a real
email service. Recommended options:
- **Mailchimp** — free up to 500 contacts, easiest to set up
- **ConvertKit** — great for civic/creator projects
- **Resend** — developer-friendly, generous free tier

### Add your domain
1. Buy `projectrevela.org` (or `.com`) from Namecheap or Google Domains
2. In Vercel dashboard → Settings → Domains → Add your domain
3. Follow the DNS instructions — takes ~10 minutes

### Phase 2 pages to add
- `/about` — Team & mission
- `/how-it-works` — Detailed explainer
- `/press` — Media kit & coverage
- `/blog` — Civic content for SEO

## Design system

| Token | Value |
|-------|-------|
| Primary blue | `#185FA5` |
| Light blue | `#E6F1FB` |
| Dark blue | `#0C447C` |
| Navy | `#1A1A2E` |
| Display font | Playfair Display |
| Body font | DM Sans |
