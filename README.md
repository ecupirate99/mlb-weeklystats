# MLB Daily Stats — Dashboard

Live 2026 MLB season leaderboards (HR, OPS, 2B, 3B, Walks, RBI, Strikeouts). Fetches real-time live data from the MLB Stats API every time the website is accessed.

Created by Quintin G.!

---

## 🚀 Quick Setup for Deployment

### 1. Database & Sync Logic (Supabase)
All database files are now in the `/supabase` folder:
- **Schema**: Run `supabase/migrations/01_schema.sql` and `03_add_walks.sql` in the Supabase SQL Editor.
- **Sync Logic**: Create an Edge Function named `sync-mlb-stats` and paste `supabase/functions/sync-mlb-stats/index.ts`.
- **Live Trigger**: The edge function is now configured to automatically run every time the app is loaded, ensuring stats are always live!

### 2. Frontend Deployment (Vercel)
This root folder is a standard Next.js app.
1. Connect this repo to **Vercel**.
2. Add these **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Click **Deploy**.

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
