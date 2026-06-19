# MLB Daily Stats — Dashboard

Live 2026 MLB season leaderboards (HR, OPS, 2B, 3B, Walks, RBI, Strikeouts). Fetches real-time live data from the MLB Stats API every time the website is accessed.

Created by Quintin G.!

---

## 🚀 Quick Setup for Deployment

This repository is a standard Next.js application that fetches data directly from the live MLB Stats API.

1. Connect this repository to **Vercel** or your preferred hosting provider.
2. Click **Deploy** — no environment variables, database, or backend setup is required!

---

## 🛠 Project Structure
```
├── app/                  # Next.js pages (Frontend)
├── components/           # UI components
├── lib/                  # Supabase client
├── supabase/             # BACKEND FILES
│   ├── migrations/       # SQL for DB tables and Cron
│   └── functions/        # TypeScript sync logic (Deno)
└── package.json          # Node dependencies
```
