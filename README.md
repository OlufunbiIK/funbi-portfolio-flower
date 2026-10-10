# Olufunbi Ibrahim, bouquet-builder portfolio

A portfolio you explore by building a bouquet, made with Next.js (App Router), React and TypeScript.

- **Build a bouquet.** Each flower is a body of work. Only the flowers a visitor picks go in the bouquet. It is composed from real
  photo cutouts, with ribbon and paper that change colour with the timeline they choose.
- **Wrap and reveal.** A ribbon is tied, a tag swings on, and the bouquet opens into the work. Each flower, and the
  **Kind words** and **Greenhouse** (tools) tabs, shows its own content.
- **Case studies**, **interactive recreated screens** with a working quote calculator, a live **GitHub contribution graph**, CV download, light and dark themes.
- **Everything at a glance.** A fast page with every project, for visitors who are short on time.
- Built phone-first: on small screens the bouquet sits above a panel with the steps.

```
src/
  app/                 layout and the single page
  components/
    flowers/           the bouquet builder (data, Bouquet, Shelf, FlowerApp)
    shared/            cards, sheets, case studies, theme switch, loader
    mocks/             the recreated app screens
  data/                projects, case studies, tools
  lib/                 site config, storage and motion hooks
  styles/flowers.css
public/                images, flower and paper cutouts, background video, CV, share image
```

## Run it on your computer

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Other commands:

```bash
npm run build      # production build
npm run start      # run the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run format     # Prettier
```

## Push to GitHub and host on Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/funbi-portfolio-flowers.git
git push -u origin main
```

Then go to https://vercel.com/new, import the repository and press **Deploy**. Vercel detects Next.js by itself,
so no settings are needed. Link previews pick up your live address automatically. If you use a custom domain,
copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` (also add it in Vercel under Settings, Environment Variables).

## Where to change things

| What | Where |
| --- | --- |
| Name, email, GitHub, LinkedIn, the account shown in the contribution graph | `src/lib/site.ts` |
| Projects (cards, sheets, stack, links, screenshots) | `src/data/projects.ts` |
| Case studies and the quotes under "Kind words" | `src/data/caseStudies.ts` |
| The tools and which projects use them | `src/data/stack.ts` |
| Recreated app screens (tabs, quote calculator) | `src/components/mocks/` |
| Colours, spacing, layout | `src/styles/` |
| Your CV | replace `public/Olufunbi_Ibrahim_CV.pdf` (keep the name) |
| Screenshots and photos | `public/images/` (WebP, referenced by the `img` field in `projects.ts`) |

## Things to check before you go live

- **Client screenshots.** The wedding, baby shower and birthday screenshots show real names, dates and a venue.
  Make sure the people involved are happy to have them on a public repository and website, or replace the files in `public/images/`.
- **Quotes.** The "Kind words" quotes name your team lead and mention the bride. Get their permission, or change `src/data/caseStudies.ts`.
- **Recreated screens.** The Leadway screens are recreated with sample data and a neutral name on purpose. The real source is private.
- **GitHub graph.** `src/lib/site.ts` has two GitHub values: `github` (the link) and `contributionsUser` (the account whose
  contribution graph is shown). Set both to the account you want visitors to see. The graph is fetched on the server and cached
  for a day. If it cannot be fetched, that section is simply hidden.
- **Fonts.** Fonts load from Google Fonts in `src/lib/layout.tsx`. You can switch to `next/font/google` later to self-host them.

## Quality notes

- Type-checked (TypeScript strict), ESLint clean, production build passes.
- Accessibility audited with axe (WCAG 2.1 AA) in both colour themes with no violations. Keyboard use, visible focus,
  skip link, reduced-motion support and native `<dialog>` for sheets.
- Checked for sideways overflow and overlaps at 11 to 15 screen sizes, from a 320px phone to a 1920px monitor, including landscape phones.
