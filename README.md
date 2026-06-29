# Poncha Index

Madeira's living poncha price index. Find where to drink poncha across the island, compare real prices, and help keep the community-powered dataset alive.

> Built by Madeira Friends Tech Lab · 2026

---

## Features

- **Price index** — Island-wide average, cheapest and priciest venue, municipality comparisons
- **Interactive map** — Leaflet + OpenStreetMap with colour-coded price pins
- **Venue directory** — 20+ venues with search, municipality filter and detail pages
- **Community contributions** — Public form to submit prices, share photos and suggest corrections
- **Moderation workflow** — Admin panel with approve/reject via secure server-side API routes
- **Changelog** — Public transparency log of every approved price update
- **Stale detection** — Prices older than 90 days are flagged as potentially outdated
- **CSV export** — Export venues and approved prices from the admin panel
- **Venue management** — Create, edit and archive venues from the admin panel
- **Responsive design** — Mobile navbar with hamburger menu, works on all screen sizes

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password, username mapped) |
| Maps | Leaflet + OpenStreetMap |
| Storage | Supabase Storage (photo uploads) |
| Hosting | Vercel |

## Getting started

### Prerequisites

- Node.js (v18+)
- npm
- Git
- A Supabase project

### Installation


git clone https://github.com/ti6xuk1y12el44/poncha-index.git

cd poncha-index

npm install


### Environment variables

Create a `.env.local` file in the project root:


NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key

SUPABASE_SECRET_KEY=your_secret_key

NEXT_PUBLIC_ADMIN_USERNAME=admin

NEXT_PUBLIC_ADMIN_EMAIL=hello@madeirafriends.org




- `NEXT_PUBLIC_` variables are sent to the browser (public)
- `SUPABASE_SECRET_KEY` stays server-side only (used in API routes)
- The admin username maps to the email for login convenience

### Run locally

npm run dev


Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to Vercel

1. Push the repository to GitHub
2. Import the project in Vercel
3. Add **all five environment variables** in Vercel project settings
4. Deploy — Vercel auto-deploys on every push to main

**Important:** If you forget `SUPABASE_SECRET_KEY` in Vercel, the admin approval will not work (API routes need it).

## Database schema

### Tables

| Table | Purpose |
|-------|---------|
| `venues` | Bars and restaurants serving poncha. Archive rather than delete. |
| `poncha_types` | Traditional regional, fisherman style, passion fruit, tangerine, other. |
| `price_submissions` | Every price enters as a submission with `pending` status. |
| `price_current` | Materialised latest approved price per venue + type for fast loading. |
| `audit_log` | Tracks admin actions for transparency. |
| `corrections` | Community-submitted corrections (from floating button). |
| `photo_submissions` | Community photo uploads with Supabase Storage URLs. |

### Row Level Security (RLS)

RLS is enabled on all tables:

- **Public (anon)** can read venues, poncha types, price_current, and approved submissions
- **Public (anon)** can insert into price_submissions (forced as `pending`), corrections, and photo_submissions
- **Only the server** (via `SUPABASE_SECRET_KEY` in API routes) can approve/reject submissions and manage venues

### API routes (server-side, secured)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/approve` | POST | Approve a submission and update price_current |
| `/api/reject` | POST | Reject a submission |
| `/api/pending` | GET | Fetch pending submissions (admin only) |
| `/api/manage-venues` | POST | Create a venue |
| `/api/manage-venues` | PUT | Edit or archive a venue |

All API routes verify the admin's auth token before executing.

## Admin guide

### Logging in

Go to `/admin/login`. Enter the admin username and password. The username is mapped to the admin email behind the scenes.

### Reviewing submissions

After login, `/admin` shows all pending price submissions. Click **Approve** to publish the price to the index, or **Reject** to discard it.

### Managing venues

Click **Manage venues** in the admin panel. You can:
- **Create** a new venue (name and slug are required, slug auto-generates from name)
- **Edit** any venue's details (address, coordinates, phone, website)
- **Archive** a venue (hides it from the public site without deleting data)
- **Restore** an archived venue

### Exporting data

Click **Export venues CSV** or **Export prices CSV** in the admin panel to download the data as spreadsheet files.

## Project structure


app/

├── page.js                  # Homepage

├── layout.tsx               # Root layout with floating button

├── not-found.js             # Custom 404 page

├── lib/

│   ├── supabase.js          # Public Supabase client

│   ├── supabaseAdmin.js     # Server-only Supabase client (secret key)

│   └── utils.js             # Utility functions (stale detection)

├── components/

│   ├── Navbar.js            # Smart navbar (transparent/solid, mobile hamburger)

│   ├── Footer.js            # Site footer

│   ├── FadeIn.js            # Scroll animation wrapper

│   ├── CountUp.js           # Animated number counter

│   ├── FloatingButton.js    # Floating menu (add price, photo, correction)

│   ├── MunicipalityStats.js # Price comparison by municipality

│   ├── VenuesMap.js         # Map wrapper (dynamic import, no SSR)

│   └── VenuesMapView.js     # Leaflet map with price-coloured pins

├── venues/│   ├── page.js              # Venues listing with search and filters

│   └── [slug]/page.js       # Individual venue detail page

├── submit/page.js           # Public price submission form

├── changelog/page.js        # Public changelog with pagination

├── admin/

│   ├── page.js              # Admin panel (approve/reject, CSV export)

│   ├── login/page.js        # Admin login (username-based)

│   └── venues/page.js       # Venue CRUD management

└── api/

├── approve/route.js     # Server-side approve

├── reject/route.js      # Server-side reject

├── pending/route.js     # Server-side fetch pending

└── manage-venues/route.js # Server-side venue CRUD


## Security notes

- RLS enabled on all tables — public key has limited permissions
- Admin operations go through server-side API routes with secret key verification
- Auth tokens are verified on every admin API call
- `SUPABASE_SECRET_KEY` never reaches the browser (`NEXT_PUBLIC_` prefix is intentionally absent)
- `.env.local` is in `.gitignore` — secrets never go to GitHub
- Photo uploads limited to 5MB per file
- Price submissions forced to `pending` status by RLS policy

## Roadmap (6-month backlog)

### Must (next priorities)
- Expand to 80+ venues with verified coordinates
- Collect 30+ approved price records before public promotion
- Add audit trail logging (who approved what and when)
- Add outlier detection (flag suspiciously high/low prices for review)
- Duplicate venue detection and merge tool

### Should
- Multilingual support (Portuguese / English)
- Photo gallery on venue pages (display uploaded photos)
- AI-assisted venue import via Google Places API
- Advanced statistics (median, historical trends, seasonal comparisons)
- Email notifications for new submissions

### Later
- AI phone calls for automated price verification (ElevenLabs + Twilio)
- Mobile app (React Native)
- Partner monetisation and sponsored listings
- Public venue rankings
- User accounts with contribution history

## Data quality rules

- The headline index uses the standard traditional poncha product only; variants are stored separately
- Approved prices must have an observed date and source type
- Prices older than 90 days are flagged as stale
- Outliers should be flagged for review rather than auto-published
- History is never overwritten — approved corrections create a new record

## Credits

Built for [Madeira Friends](https://madeirafriends.org) · Madeira Friends Tech Lab · 2026