# EHS Flux Corporation — Website

> **Water Treatment & Zero Liquid Discharge Consulting**
> Specialist consulting for chemical, pharmaceutical and process industries.
> Plot No. 803, Khanamet Village, Khanamet, Hyderabad, Telangana 500084, India
> Email: [info@ehsflux.com](mailto:info@ehsflux.com) · Phone: [+91 90032 39022](tel:+919003239022)

A clean, fresh, professional, blue-and-white corporate website for EHS Flux Corporation. Built as a static HTML/CSS/JavaScript frontend with a Vercel serverless API endpoint for enquiry email delivery via Resend.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Quick Start (Local)](#4-quick-start-local)
5. [Editor Setup (VS Code)](#5-editor-setup-vs-code)
6. [Running Locally](#6-running-locally)
7. [Configuring Environment Variables](#7-configuring-environment-variables)
8. [Verifying the Sender Domain with Resend](#8-verifying-the-sender-domain-with-resend)
9. [Setting the Recipient to info@ehsflux.com](#9-setting-the-recipient-to-infoehsfluxcom)
10. [Configuring Environment Variables in Vercel](#10-configuring-environment-variables-in-vercel)
11. [Deploying via GitHub + Vercel](#11-deploying-via-github--vercel)
12. [Testing the Real Enquiry Email](#12-testing-the-real-enquiry-email)
13. [Troubleshooting](#13-troubleshooting)
14. [International Phone Handling](#14-international-phone-handling)
15. [Security & Privacy](#15-security--privacy)
16. [Acceptance Checklist](#16-acceptance-checklist)

---

## 1. Project Overview

This project is a complete corporate website for EHS Flux Corporation. It includes:

- A single-page marketing site with hero, six consulting service cards, a five-image Water Treatment equipment gallery, ZLD solutions section, industries grid, About section with four strengths, and a contact form.
- A top information bar with telephone, email, and address.
- A sticky navigation with a prominent "Send an Enquiry" CTA.
- A responsive mobile navigation menu.
- A dark navy footer with company branding, contact details, and navigation links.
- A privacy notice page (`/privacy.html`) and a custom 404 page.
- A serverless `/api/contact` endpoint that receives validated enquiry data and forwards it to `info@ehsflux.com` via Resend.
- An international phone-number selector (`intl-tel-input`) with country-aware validation and E.164 normalisation.

### Design theme

- **Deep navy `#073B70`** — footer and strong headings
- **Corporate blue `#0969B8`** — primary buttons
- **Bright water blue `#16A9E8`** — restrained accent
- **Light aqua `#EAF8FF`** and **very light blue `#F5FAFE`** — section backgrounds
- **White `#FFFFFF`** — primary surface
- **Primary text `#17324D`**, **secondary text `#52677D`**, **subtle borders `#D8EAF7`**

Typography: Inter (body) + Manrope (headings). Both loaded from Google Fonts.

### Official company information

| Field | Value |
|---|---|
| Company name | EHS Flux Corporation |
| Tagline | Water Treatment & Zero Liquid Discharge Consulting |
| Email | info@ehsflux.com |
| Phone | +91 90032 39022 |
| Address | Plot No. 803, Khanamet Village, Khanamet, Hyderabad, Rangareddy District, Telangana 500084, India |

The enquiry recipient email (`CONTACT_TO_EMAIL`) is `info@ehsflux.com`.

---

## 2. Tech Stack

- **Frontend:** Static HTML5, modern CSS3 (Grid + Flexbox, custom properties), vanilla JavaScript (ES6+).
- **International phone input:** [intl-tel-input](https://github.com/jackocnr/intl-tel-input) v18.2.1, loaded from jsDelivr CDN. Includes the `utils.js` helper for country-aware validation and E.164 formatting.
- **Backend (serverless):** Vercel Serverless Functions (Node.js 18+). Single endpoint at `/api/contact`.
- **Email provider:** [Resend](https://resend.com) — transactional email API.
- **Hosting:** Vercel (recommended). Also deployable to Netlify with a serverless functions folder rename.
- **Fonts:** Inter + Manrope from Google Fonts (preconnect for performance).

No frontend build step is required. The `public/` folder is served as-is by Vercel.

---

## 3. Project Structure

```
ehs-flux/
├── public/                      # Static site root (Vercel outputDirectory)
│   ├── assets/
│   │   ├── logo/
│   │   │   ├── ehs-flux-logo.png            # Full transparent logo (1050×1350)
│   │   │   ├── ehs-flux-logo-compact.png    # Tightly-cropped logo (370×265)
│   │   │   ├── ehs-flux-logo-navbar.png    # Square navbar version (160×160)
│   │   │   └── ehs-flux-logo-light.png      # White-tinted version for dark footer
│   │   └── images/
│   │       ├── hero.jpg                     # Hero image (water drop + plant)
│   │       ├── zld-process.jpg              # ZLD process flow diagram
│   │       ├── about.jpg                    # About section image
│   │       ├── cta-banner.jpg               # CTA banner image
│   │       ├── service-water-treatment.jpg
│   │       ├── water-treatment-multimedia-filter.jpg
│   │       ├── water-treatment-softener.jpg
│   │       ├── water-treatment-demineralization.jpg
│   │       ├── water-treatment-ultrafiltration.jpg
│   │       ├── water-treatment-ro-plant.jpg
│   │       ├── service-etp-upgradation.jpg
│   │       ├── service-feasibility.jpg
│   │       ├── service-project-support.jpg
│   │       ├── service-compliance.jpg
│   │       └── service-zld-spotlight.jpg
│   ├── css/
│   │   └── styles.css                       # Complete blue theme
│   ├── js/
│   │   ├── main.js                          # Navigation, mobile menu, smooth scroll
│   │   └── contact-form.js                  # intl-tel-input, validation, fetch /api/contact
│   ├── favicon.svg
│   ├── site.webmanifest
│   ├── index.html                           # Main single-page site
│   ├── privacy.html                         # Privacy notice
│   └── 404.html                             # Custom 404 page
├── api/
│   └── contact.js                           # Vercel serverless function (Resend)
├── tests/
│   ├── README.md                            # Manual test checklist
│   ├── validation.test.js                   # Pure-function tests (no network)
│   ├── api.test.js                          # Tests /api/contact with mocked Resend
│   └── run-tests.js                         # Test runner
├── docs/
│   └── DEPLOYMENT.md                        # Step-by-step deployment guide
├── .env.example                             # Environment variables template
├── .gitignore
├── vercel.json                              # Vercel config + security headers
├── package.json                             # npm scripts and metadata
├── LICENSE                                  # MIT
└── README.md                                # This file
```

---

## 4. Quick Start (Local)

### Prerequisites

- **Node.js 18 LTS or newer** (recommend 20 LTS). Download from <https://nodejs.org/>.
- **npm 9 or newer** (bundled with Node.js).
- **Git** (optional, for version control).
- **VS Code** (recommended editor) — <https://code.visualstudio.com/>.

### Five-step local run

```bash
# 1. Extract the ZIP
unzip EHS_Flux_Corporation_Final.zip -d ehs-flux
cd ehs-flux

# 2. Install the dev dependency (a tiny static file server)
npm install

# 3. Copy the environment template and fill in your values
cp .env.example .env
# Edit .env with your RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL

# 4. Start a local web server on http://localhost:3000
npm start

# 5. (Optional) Test the API endpoint locally with Vercel CLI
npm install -g vercel
vercel dev
# This runs both the static site and the /api/contact function locally
```

Open <http://localhost:3000> in your browser.

> ⚠️ **Important:** VS Code Live Server alone will NOT execute the Vercel serverless API at `/api/contact`. Live Server is fine for previewing the static visual layout, but to test the actual enquiry flow (form submission → email delivery), you must use `vercel dev` or deploy to Vercel.

---

## 5. Editor Setup (VS Code)

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Open the extracted project folder: **File → Open Folder…** → select `ehs-flux/`.
3. Recommended extensions (install from the Extensions panel, Ctrl+Shift+X):
   - **Live Server** (`ritwickdey.LiveServer`) — for static HTML preview only.
   - **ESLint** (`dbaeumer.vscode-eslint`) — for JavaScript linting.
   - **Prettier** (`esbenp.prettier-vscode`) — for code formatting.
   - **HTML CSS Support** (`ecmel.vscode-html-css`) — for CSS class autocomplete.
4. To preview the static site with hot-reload: right-click `public/index.html` → **Open with Live Server**.
5. To test the enquiry form end-to-end, use `vercel dev` from the terminal instead.

---

## 6. Running Locally

### Option A — Static preview only (no enquiry email)

```bash
npm install
npm start
# Visit http://localhost:3000
```

Use this to verify the visual layout, navigation, mobile responsiveness, and form validation. The form's "Send Enquiry" button will hit `/api/contact` which will 404 (since there is no serverless runtime). The form will show an error message — this is expected.

### Option B — Full local stack (static site + enquiry API)

Install the Vercel CLI globally:

```bash
npm install -g vercel
vercel login   # one-time, with your Vercel account
```

Then from the project root:

```bash
vercel dev --listen 3000
```

This serves the static site from `public/` and runs the `api/contact.js` function locally at `http://localhost:3000/api/contact`. Form submissions will work end-to-end if you have set the environment variables (see [§7](#7-configuring-environment-variables)).

For local `vercel dev` to read your `.env` file, the file must be at the project root and named `.env`. Variables in `.env` are picked up automatically.

---

## 7. Configuring Environment Variables

The `/api/contact` endpoint requires three environment variables:

| Variable | Purpose | Example value |
|---|---|---|
| `RESEND_API_KEY` | Resend API key (secret, server-side only) | `re_abc123…` |
| `CONTACT_FROM_EMAIL` | Sender email authorised by Resend (must be on a verified domain) | `enquiries@ehsflux.com` |
| `CONTACT_TO_EMAIL` | Recipient inbox for enquiries (defaults to `info@ehsflux.com` if unset) | `info@ehsflux.com` |

### Local

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in a text editor.
3. Fill in the three values (do not commit this file to git — it is already in `.gitignore`).
4. Restart `vercel dev` to pick up the changes.

### Production (Vercel)

Set the same three variables in the Vercel dashboard (see [§10](#10-configuring-environment-variables-in-vercel)).

---

## 8. Verifying the Sender Domain with Resend

Resend only delivers email from sender addresses on a verified domain. Until verification is complete, the only sender Resend allows is `onboarding@resend.dev` (limited to your account's own email address — useful for testing only).

### Steps to verify your domain

1. Sign in to <https://resend.com> (create a free account if needed).
2. Go to **Domains** → **Add Domain**.
3. Enter your domain — e.g. `ehsflux.com` (recommended) or a subdomain like `mail.ehsflux.com`.
4. Resend displays a set of DNS records to add at your domain registrar / DNS provider:
   - **TXT** record for SPF
   - **MX** record(s)
   - **TXT** record for DKIM (often shown as multiple TXT records)
5. Open your DNS provider's control panel (Cloudflare, GoDaddy, Namecheap, etc.) and add the records exactly as shown.
6. Wait for DNS propagation (typically 5–60 minutes). Click **Verify** in Resend.
7. Once verified, the domain shows a green "Verified" badge. You can now send from any address `@ehsflux.com`.

### Recommended sender address

Use a non-personal address like `enquiries@ehsflux.com` or `noreply@ehsflux.com` as `CONTACT_FROM_EMAIL`. The recipient (`CONTACT_TO_EMAIL`) is `info@ehsflux.com` — the company's official enquiry inbox.

The customer's email address is set as the email's `Reply-To` header, so when the team replies to the email in their inbox, the reply goes directly to the customer.

---

## 9. Setting the Recipient to info@ehsflux.com

The recipient is controlled by the `CONTACT_TO_EMAIL` environment variable. The endpoint defaults to `info@ehsflux.com` if the variable is unset (see `api/contact.js` line that reads `process.env.CONTACT_TO_EMAIL || 'info@ehsflux.com'`), but you should set it explicitly for clarity.

```bash
# In .env (local) or Vercel project settings (production):
CONTACT_TO_EMAIL=info@ehsflux.com
```

The recipient is hardcoded in the contact form's frontend (so users see `info@ehsflux.com` in the UI regardless of env vars), but the actual email delivery destination is controlled by `CONTACT_TO_EMAIL`.

---

## 10. Configuring Environment Variables in Vercel

1. Go to <https://vercel.com/> and sign in with your Vercel account.
2. Click **Add New… → Project**.
3. Import your GitHub repository (see [§11](#11-deploying-via-github--vercel)).
4. After import, go to **Settings → Environment Variables** (left sidebar).
5. Add each variable:

   | Name | Value | Environments |
   |---|---|---|
   | `RESEND_API_KEY` | `re_xxxxxxxx…` | Production, Preview, Development |
   | `CONTACT_FROM_EMAIL` | `enquiries@ehsflux.com` | Production, Preview, Development |
   | `CONTACT_TO_EMAIL` | `info@ehsflux.com` | Production, Preview, Development |

6. Click **Save**.
7. Redeploy the project: **Deployments → ⋮ → Redeploy** (or push a new commit to GitHub).

---

## 11. Deploying via GitHub + Vercel

### Step 1 — Push to GitHub

```bash
# From the project root
git init
git add .
git commit -m "feat: EHS Flux Corporation website"
git branch -M main
git remote add origin git@github.com:your-org/ehs-flux.git
git push -u origin main
```

Make sure `.env` is NOT committed (it is in `.gitignore` by default).

### Step 2 — Import into Vercel

1. Go to <https://vercel.com/new>.
2. Find your GitHub repository and click **Import**.
3. Vercel auto-detects:
   - **Framework Preset:** Other (static site)
   - **Root Directory:** `./` (the project root)
   - **Build Command:** none (no build step)
   - **Output Directory:** `public` (configured in `vercel.json`)
   - **Install Command:** `npm install` (just installs `serve` dev dependency)
4. Click **Environment Variables** and add the three variables from [§10](#10-configuring-environment-variables-in-vercel).
5. Click **Deploy**.

Vercel will:
- Serve `public/` as the static site at `https://your-project.vercel.app`.
- Deploy `api/contact.js` as a serverless function at `https://your-project.vercel.app/api/contact`.
- Apply the security headers and redirects from `vercel.json`.

### Step 3 — Add a custom domain (optional)

1. In Vercel: **Project Settings → Domains → Add**.
2. Enter `ehsflux.com` (or `www.ehsflux.com`).
3. At your DNS provider, add the records Vercel shows (CNAME or A record).
4. Vercel provisions an SSL certificate automatically once DNS resolves.
5. Wait 5–60 minutes for propagation.

---

## 12. Testing the Real Enquiry Email

### Pre-flight checklist

- [ ] Resend domain is **Verified** (green badge in Resend dashboard).
- [ ] `CONTACT_FROM_EMAIL` is set to an address on that domain.
- [ ] `CONTACT_TO_EMAIL` is set to `info@ehsflux.com`.
- [ ] Environment variables are set in Vercel (Production).
- [ ] Latest deployment is live.

### Test the live form

1. Visit your deployed site (e.g., `https://ehsflux.com`).
2. Click **Send an Enquiry** in the nav or **Discuss Your Requirements** in the hero.
3. Fill in the form:
   - Use a real email address you can receive mail at (so you can verify the Reply-To works).
   - Select a country (try India, USA, UK, UAE, Australia for variety).
   - Enter a valid phone number for the selected country.
   - Provide a detailed message describing a real (or sample) project.
4. Submit.
5. Check `info@ehsflux.com` inbox — the enquiry should arrive within 30 seconds.
6. Reply to the email in your inbox — the reply should go to the email address you entered in the form (the Reply-To header is set to the customer's email).

### Expected email contents

The delivered email includes:

| Field | Source |
|---|---|
| Customer's full name | Form → `name` |
| Company name (if provided) | Form → `company` |
| Email address | Form → `email` (also set as Reply-To) |
| International phone number (E.164) | Form → `phone` (with `phoneCountry` if available) |
| Selected requirement | Form → `requirement` |
| Subject | Form → `subject` (prefixed with `[EHS Flux Enquiry]`) |
| Full message | Form → `message` |
| Submission timestamp | Generated server-side (UTC ISO 8601) |
| Source page | Form → `sourcePage` |

### If delivery fails

See [§13 Troubleshooting](#13-troubleshooting).

---

## 13. Troubleshooting

### Form returns "Email delivery is not yet configured"

**Cause:** `RESEND_API_KEY` or `CONTACT_FROM_EMAIL` is not set in the Vercel environment.

**Fix:**
1. Go to **Vercel → Settings → Environment Variables**.
2. Add the missing variables.
3. Redeploy.

### Form returns "Email delivery provider returned an error"

**Cause:** Resend returned an error (4xx or 5xx). Common causes:

- **422 `from` field does not match a verified domain** — `CONTACT_FROM_EMAIL` is on a domain you have not verified in Resend. Verify the domain or use an address on an already-verified domain.
- **403 `API key invalid`** — `RESEND_API_KEY` is wrong, expired, or revoked. Generate a new key in Resend → API Keys.
- **429 `Rate limit exceeded`** — too many requests in a short window. Wait 60 seconds and retry.
- **500** — Resend-side issue. Check the Resend status page (<https://status.resend.com>).

**Debug:**
- Check Vercel function logs: **Vercel → Project → Functions → /api/contact → Logs**.
- The full Resend response is logged with `console.error('Resend API error:', …)`.

### Form returns "A network error occurred"

**Cause:** The frontend could not reach `/api/contact`. This usually means:

- The site was opened via `file://` (no server) — use `npm start` or `vercel dev`.
- The deployment is missing the `api/contact.js` function (check the deploy logs).
- The function timed out (10s default in Vercel hobby tier) — should not happen for a single Resend call.

### Phone number validation fails

- The `intl-tel-input` library validates numbers against the selected country's rules.
- Example valid numbers for testing:
  - India (+91): `9876543210` (mobile, 10 digits, starts with 6–9)
  - USA (+1): `5551234567` (10 digits)
  - UK (+44): `7911234567` (mobile, 10 digits, starts with 7)
  - UAE (+971): `501234567` (mobile, 9 digits)
  - Australia (+61): `412345678` (mobile, 9 digits)
- The server normalises valid numbers to E.164 (`+91 98765 43210` style — no duplicate dial code).

### Email arrives but Reply-To doesn't work

The `reply_to` field is set to the customer's email in the Resend payload (`api/contact.js`). If your email client doesn't show Reply-To:

- Gmail: click the three dots → "Show original" → look for `Reply-To:` header.
- Outlook: it should auto-populate the Reply-To in the compose window.

### CORS or "Method not allowed"

- The endpoint only accepts `POST`. Preflight `OPTIONS` is handled automatically by Vercel.
- The endpoint does not add an `Access-Control-Allow-Origin` header — same-origin requests only (the form is on the same domain as the API).

### `vercel dev` returns 404 for `/api/contact`

- Verify `api/contact.js` exists at the project root (not inside `public/`).
- Verify `vercel.json` does not have a `rewrites` rule that swallows the `/api/*` path. (The current `vercel.json` does not include such rewrites.)

---

## 14. International Phone Handling

The phone input is powered by [intl-tel-input](https://github.com/jackocnr/intl-tel-input) v18.2.1, loaded from the jsDelivr CDN.

Features:

- **Searchable country selector** with flags, names, and international calling codes.
- **India (+91) selected by default** (the company's home market).
- **Supports all countries and territories** in the intl-tel-input data set (no manual limit).
- **Country-aware validation** — uses the `libphonenumber` utils script.
- **E.164 normalisation** — the server receives the full international number (e.g. `+919876543210`) without duplicating the dial code.
- **Keyboard accessible** — type to search, arrow keys to navigate, Enter to select.
- **Responsive** — the dropdown adapts to mobile viewport.

### Tested countries

| Country | Code | Example valid number |
|---|---|---|
| India | +91 | 9876543210 |
| United States | +1 | 5551234567 |
| United Kingdom | +44 | 7911234567 |
| United Arab Emirates | +971 | 501234567 |
| Australia | +61 | 412345678 |

Invalid number cases (too short, wrong length for the country) are rejected on both client and server.

---

## 15. Security & Privacy

### Security headers (set in `vercel.json`)

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HSTS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN` (clickjacking protection)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

### Server-side validation

`api/contact.js` performs:

- **Body size limit** (16KB max)
- **JSON parsing** with error handling
- **Per-IP rate limiting** (3 submissions per minute per IP)
- **Honeypot check** — the hidden `website` field, if filled, triggers silent success (to confuse bots)
- **Strict server-side validation** of every field (name length, email regex, E.164 phone, allowed requirement values, subject length, message length)
- **HTML escaping** of all user-provided strings before they go into the email body (defence in depth)
- **Allowed-list of requirement values** — the dropdown value must match one of the seven allowed strings

### Credential handling

- API keys are stored as Vercel environment variables, never in the codebase.
- The `.env` file is in `.gitignore`.
- The `.env.example` file contains placeholder values only.

### Privacy

- The privacy notice at `/privacy.html` explains exactly what data is collected and how it is processed.
- The form includes a link to the privacy notice above the submit button.
- The website uses **no tracking cookies, no advertising cookies, no third-party analytics**. The only third-party resources loaded are Google Fonts and the intl-tel-input library from jsDelivr CDN.

### Content Security Policy

No formal CSP header is set by default. To add one, edit `vercel.json` and add a `Content-Security-Policy` header. Suggested policy:

```
default-src 'self';
script-src 'self' https://cdn.jsdelivr.net;
style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self' https://api.resend.com;
```

(Add this under `headers` in `vercel.json` for the `/(.*)` source.)

---

## 16. Acceptance Checklist

Confirm each item before going live:

### Visual

- [ ] Blue theme applied consistently (navy, corporate blue, aqua, light backgrounds).
- [ ] EHS Flux logo appears in navbar (compact) and footer (white-tinted for dark background).
- [ ] Hero image (water drop + treatment plant) loads.
- [ ] Hero headline text reads "Expert Consulting for Water Treatment & Zero Liquid Discharge Plants".
- [ ] Two CTAs visible in hero: "Discuss Your Requirements" (primary) and "Explore Our Services" (secondary).
- [ ] Six consulting service cards present with line icons.
- [ ] ZLD section has water-themed image + 8-item checklist.
- [ ] Six industries cards present with relevant icons.
- [ ] About section has the company image + four key strengths (Specialized Expertise, Practical Solutions, End-to-End Support, Sustainability Focus).
- [ ] Contact form has 7 fields (name, company, email, phone, requirement, subject, message).
- [ ] Footer is dark navy with white text, logo, contact details, and links.

### Functional

- [ ] All navigation links scroll to the correct section.
- [ ] "Send an Enquiry" button in nav scrolls to the contact form.
- [ ] Mobile navigation menu opens/closes correctly.
- [ ] International phone selector shows flags, names, calling codes.
- [ ] Phone selector defaults to India (+91).
- [ ] Phone validation works for India, USA, UK, UAE, Australia.
- [ ] Invalid phone numbers show a clear error.
- [ ] Required fields reject empty submissions.
- [ ] Email field validates format.
- [ ] Form submission shows a loading spinner on the submit button.
- [ ] Form submission shows success only after Resend accepts the request.
- [ ] Form submission shows error if Resend fails or returns non-2xx.
- [ ] Form errors do not clear the customer's other entries.
- [ ] Privacy notice link in the form footer opens `privacy.html`.
- [ ] Custom 404 page shows for non-existent paths.

### Contact details consistency

- [ ] Telephone shown as **+91 90032 39022** (top bar, contact section, footer).
- [ ] Email shown as **info@ehsflux.com** (top bar, contact section, footer).
- [ ] Address shown as **Plot No. 803, Khanamet Village, Khanamet, Hyderabad, Rangareddy District, Telangana 500084, India** (top bar, contact section, footer).
- [ ] Telephone link is `tel:+919003239022` (clickable).
- [ ] Email link is `mailto:info@ehsflux.com` (clickable).
- [ ] Address link opens Google Maps search for the postal address.
- [ ] No mention of the old `ehs.flux@gmail.com` anywhere.

### Responsive

- [ ] Desktop (1280px+): two-column hero, three-column service grid, side-by-side ZLD, two-column About strengths.
- [ ] Tablet (768–1024px): single-column hero, two-column service grid, stacked ZLD, stacked About.
- [ ] Mobile (≤767px): single-column everything, stacked form fields, hamburger menu.

### Performance

- [ ] Hero image lazy-loaded? (No — hero is `loading="eager"` because it's above the fold, which is correct.)
- [ ] Below-the-fold images are `loading="lazy"`.
- [ ] Fonts use `preconnect` for Google Fonts.

### Accessibility

- [ ] Skip-to-content link visible on first Tab.
- [ ] All interactive elements keyboard accessible.
- [ ] Visible focus indicators (aqua outline).
- [ ] Semantic headings (one h1 in hero, h2s for each section, h3s for cards).
- [ ] All images have descriptive alt text.
- [ ] Form labels are properly associated (`for`/`id`).
- [ ] Form errors use `role="alert"` and `aria-live="polite"`.
- [ ] Color contrast meets WCAG AA.

### Security

- [ ] `.env` is in `.gitignore` and not committed.
- [ ] No API keys in any frontend file (`public/`).
- [ ] HTTPS enforced (HSTS header set).
- [ ] Honeypot field present in the form (hidden `website` field).
- [ ] Server validates every field again, even if client validation passes.

### Deployment

- [ ] Vercel deployment succeeds.
- [ ] `/api/contact` returns 200 on valid POST.
- [ ] `/api/contact` returns 405 on GET.
- [ ] `/api/contact` returns 422 on invalid POST.
- [ ] `/api/contact` returns 429 on rate-limit exceedance.
- [ ] Static assets (`/css/`, `/js/`, `/assets/`) have long-cache headers.
- [ ] Custom 404 page is served for unknown routes.
- [ ] `/privacy.html` is reachable.

---

## License

MIT — see [LICENSE](LICENSE).

## Contact

For questions about this codebase or to report an issue:

- **Email:** [info@ehsflux.com](mailto:info@ehsflux.com)
- **Phone:** [+91 90032 39022](tel:+919003239022)
- **Address:** Plot No. 803, Khanamet Village, Khanamet, Hyderabad, Rangareddy District, Telangana 500084, India

---

*Smart Solutions · Sustainable Tomorrow*
