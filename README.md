# Holiday Configurator

A sweet multi-step trip planner for Marina, built with Next.js and React.

## Getting started

1. Copy `.env.example` to `.env.local` and fill in **SMTP** settings (see below).

2. Install and run:

   ```bash
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## How email works

The first version used a `mailto:` link. That only opens Marina’s **local email app** (Outlook, Mail, etc.) — nothing is sent from your website.

Sending from the site needs a **backend** (the `/api/send-trip-request` route) and an **SMTP provider** (Gmail, Brevo, SendGrid, etc.) so the server can deliver mail to your inbox.

Required variables in `.env.local`:

| Variable | Purpose |
|----------|---------|
| `TRIP_REQUEST_EMAIL` | Your inbox — where requests arrive |
| `SMTP_HOST` | e.g. `smtp.gmail.com` |
| `SMTP_PORT` | Usually `587` (TLS) or `465` (SSL) |
| `SMTP_USER` | Login / API user from the provider |
| `SMTP_PASS` | App password or SMTP key (not your normal login password for Gmail) |
| `SMTP_FROM` | Display name + address shown as sender |

Restart `npm run dev` after changing `.env.local`.

### Gmail example

1. Turn on [2-Step Verification](https://myaccount.google.com/security).
2. Create an [App Password](https://myaccount.google.com/apppasswords) for “Mail”.
3. In `.env.local`:

   ```
   TRIP_REQUEST_EMAIL=you@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=you@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   SMTP_FROM="For Marina <you@gmail.com>"
   ```

### Other providers

- **Brevo (Sendinblue):** SMTP tab in dashboard → `smtp-relay.brevo.com`, port `587`.
- **SendGrid:** create an API key with Mail Send, use SMTP relay credentials.

## Steps

1. Welcome — Yes / evasive No button
2. Date range picker
3. Trip destination options (multi-select)
4. Optional message and send (server email to you)

## Customize

Edit trip options in `src/lib/trip-options.ts`.

## Deploy to Vercel

Vercel is made for Next.js: each push to GitHub can auto-deploy. `.env.local` stays on your machine — you copy the same variables into the Vercel dashboard.

### 1. Push the repo to GitHub

From the project folder (first time only):

```bash
git add .
git commit -m "Initial trip planner for Marina"
git push -u origin main
```

If `main` does not exist on GitHub yet, create the repo on GitHub first or let the first push create it.

### 2. Import on Vercel

1. Sign in at [vercel.com](https://vercel.com) (GitHub login is easiest).
2. **Add New… → Project**.
3. Import **HolidayConfigurator** from your GitHub account.
4. Leave defaults: **Framework Preset: Next.js**, **Root Directory:** `.`, **Build Command:** `npm run build`, **Output:** (automatic).
5. Do **not** deploy yet — open **Environment Variables** first.

### 3. Add environment variables

Add each variable for **Production** (and **Preview** if you want PR previews to send mail too):

| Name | Example | Notes |
|------|---------|--------|
| `TRIP_REQUEST_EMAIL` | `you@gmail.com` | Your inbox |
| `SMTP_HOST` | `smtp.gmail.com` | From your provider |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | `you@gmail.com` | |
| `SMTP_PASS` | `abcd efgh ijkl mnop` | Gmail **App Password**; mark as **Sensitive** |
| `SMTP_FROM` | `For Marina <you@gmail.com>` | Quotes optional in Vercel UI |

Values should match what works in `.env.local`. Never commit `.env.local` or paste secrets into the repo.

### 4. Deploy

Click **Deploy**. When the build finishes, Vercel gives you a URL like `https://holiday-configurator-xxx.vercel.app`.

### 5. Optional: custom domain

Project → **Settings → Domains** → add your domain and follow DNS instructions.

### 6. Later updates

```bash
git add .
git commit -m "Describe your change"
git push
```

Vercel rebuilds automatically on each push to `main`.

### Troubleshooting

- **503 / “Email is not configured”** — A variable is missing in Vercel or only set for Development. Redeploy after adding vars (**Deployments → … → Redeploy**).
- **500 on send** — Wrong SMTP password, or provider blocking datacenter IPs. Try Brevo/SendGrid SMTP if Gmail fails from Vercel.
- **Local works, production fails** — Env vars are per environment; check **Production** in Vercel settings.
