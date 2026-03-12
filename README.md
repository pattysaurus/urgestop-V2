# UrgeStop v2 — Full Stack Recovery App

## What's new in v2
- Real login / signup for every user
- Sobriety progress saves to database (no more hardcoded 47 days)
- Journal entries save and load from Supabase
- Daily pledges save per user per day
- Edit your sobriety start date anytime
- No external APIs except the AI coach

## Quick Start

```bash
npm install
# fill in .env.local with your keys
# run database-setup.sql in Supabase SQL Editor
npm run dev
# open http://localhost:3000
```

## File Structure
```
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── api/coach/route.ts   ← Claude AI (server-side only)
├── components/
│   ├── App.tsx              ← Root: handles auth state
│   ├── AuthPage.tsx         ← Login / Signup page
│   ├── Onboarding.tsx       ← First-time setup
│   ├── Dashboard.tsx        ← Main shell with tabs
│   ├── HomeTab.tsx          ← Urge button + tips
│   ├── TrackerTab.tsx       ← Sobriety stats (real data)
│   ├── JournalTab.tsx       ← Urge log (saves to DB)
│   ├── PledgeTab.tsx        ← Daily check-ins (saves to DB)
│   ├── CoachTab.tsx         ← AI chat
│   └── GroundingExercise.tsx
└── lib/
    └── supabase.ts
```
