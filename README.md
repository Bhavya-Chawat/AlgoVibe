# 🎉 AlgoVibe 2025 — Website

A lightweight Next.js site for the AlgoVibe challenge: register teams, validate entries, store data in Supabase, and send confirmation emails via Gmail SMTP. It also showcases event details, phases, and the problem flow (solve → visualize).

## 🧠 Event Snapshot
- Duration: 90‑minute challenge + 30‑minute visualization workshop
- Format: Offline; problem revealed at the start of the 90‑minute window
- Teams: ISE students only; 2–3 members (no solo participation)
- Flow: Level 1 — solve a non‑trivial DSA problem; Level 2 — build an interactive web visualization
- Deliverables: GitHub repository, deployed URL, and a short README
- Judging: Visualization & creativity (60%), clarity (20%), technical correctness (20%)

## ⚡ Features
- Registration form with robust client + server validation
- Team insert + members bulk insert in Supabase
- Case‑insensitive USN uniqueness checks
- Gmail SMTP confirmation email (leader or first member recipient)
- Mobile‑first UI with Tailwind + Framer Motion
- Clear phases timeline and concise “Problem Statement” section

## 🛠️ Tech Stack
- Framework: Next.js (App Router), React, TypeScript
- UI: Tailwind CSS, Lucide icons, Framer Motion
- Data: Supabase (Postgres)
- Email: Nodemailer + Gmail SMTP (App Password)

## 🚀 Getting Started
1) Clone and install
~~~
  git clone <your-repo-url>
  cd algovibe
  npm install
~~~

3) Create .env
 ~~~
Copy .env.example to .env and fill values (see below)
~~~

3) Run locally
~~~
npm run dev
~~~
- Open http://localhost:3000

## 🔐 Environment Variables
Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Gmail SMTP (use App Password, not your regular password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_char_app_password
FROM_EMAIL=your_gmail@gmail.com

Notes:
- Enable 2‑Step Verification in your Google account → create an App Password → use that as SMTP_PASS.
- Do not prefix these with NEXT_PUBLIC_ (except the Supabase public vars).

## 🧾 API
POST /api/register
- Body:
~~~
{
"teamName": "string",
"teamMembers": [
{
"name": "string",
"role": "Leader" | "Member",
"usn": "string?",
"email": "string?",
"phone_number": "10-digit string",
"section": "A" | "B" | null,
"github_profile": "url?",
"linkedin_profile": "url?"
}
]
}
~~~
- Responses:
  - 201: { message, teamId, teamName, members }
  - 400: validation errors (friendly message)
  - 409: conflicts (team name taken or USN already registered)
  - 415/500: content type or server error

## ✅ Validation Rules (high level)
- Team size: 2–3 members; exactly one Leader
- Leader phone required (10 digits); any active Member must include phone too
- Section must be A/B where provided
- GitHub/LinkedIn validated if present
- Team name unique; USN unique (case‑insensitive) across DB
- Emails unique within the submitted team

## 🧭 Content Highlights (used on site)
- Problem scope: Arrays, Linked Lists, Stacks, Queues, Trees, Graphs
- Flow: Level 1 solve → Level 2 visualize process & state transitions
- Reveal: Problem at T0 of the 90‑minute window
- Deliverables: Repo + live URL + short README
- Focus: Correctness, clarity, creativity, UX/performance

## 🧪 Troubleshooting
- Gmail “auth failed”: ensure 2FA on, use a 16‑char App Password, correct SMTP_HOST/PORT
- 409 on USN/team: pick a new team name or USN
- Supabase errors: confirm URL/key, table names, RLS/permissions
- Dev server issues: delete .next, reinstall (rm -rf node_modules && npm i)

## 📬 Deployment
- Recommended: Vercel for Next.js
- Add the same env vars in your hosting dashboard
- Ensure Supabase URL/key are set to production values

## 📄 License
- Internal/educational event project; license per your org’s standards

## 🤝 Contact
- Core team
- Issues/bugs: open a repo issue with steps to reproduce
