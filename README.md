# Betini Trips — Website

Static site. No build step, no framework, no dependencies. HTML, CSS, vanilla JS.
Built to load fast on a mid-range Android on Nigerian 4G.

**Client:** Betini Trips & Tours Services Ltd (RC 2000269)
**Founder:** Mrs Demi James
**Built by:** Swellbridge Digital

---

## Deploy

### 1. GitHub

```bash
cd betini-trips
git init
git add .
git commit -m "Betini Trips website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/betini-trips.git
git push -u origin main
```

### 2. Netlify

1. Netlify → **Add new site** → **Import an existing project** → GitHub → pick the repo.
2. Build command: **leave blank**. Publish directory: **`.`**
3. Deploy.

`netlify.toml` already sets caching headers, security headers and clean URLs.

### 3. Namecheap domain

1. Buy the domain (suggest **betinitrips.com**).
2. Netlify → **Domain management** → **Add a domain you already own** → enter it.
3. Netlify gives you four nameservers. In Namecheap: **Domain → Nameservers → Custom DNS** → paste all four.
4. Wait for propagation (usually under an hour, up to 24h).
5. Netlify → **HTTPS** → **Verify DNS configuration** → **Provision certificate**. Free, automatic.

### 4. After the domain is live — one find-and-replace

The canonical URLs, sitemap and Open Graph tags currently point at
`https://www.betinitrips.com`. If you buy a different domain, replace that string
across the project:

```bash
grep -rl "www.betinitrips.com" . | xargs sed -i 's|www.betinitrips.com|YOUR-DOMAIN.com|g'
```

### 5. Contact form

The form is already wired for **Netlify Forms** (`data-netlify="true"`).
It works the moment the site is on Netlify. No configuration needed.
Set the notification email: Netlify → **Forms** → **Form notifications** → add an email address.

Spam protection is a honeypot field plus a submit-timing check. **No CAPTCHA** — deliberately, because CAPTCHAs kill mobile conversion.

---

## Before this goes live — outstanding items

| # | Item | Why it matters |
|---|------|----------------|
| 1 | **Confirm the email address.** Currently `betinitrips@gmail.com` (a placeholder). Search and replace across all files once decided. | It appears in the footer, contact page, Terms, Privacy and the schema markup. |
| 2 | **Confirm the reply window.** The site currently promises **"within 4 hours during the day."** Change it if she wants a different figure. It appears in the hero, footer, contact page and FAQ. | It is a public promise. Only make one she will keep. |
| 3 | **Facebook and TikTok handles.** The footer currently points both social icons at Instagram. | Two dead-ish links. |
| 4 | **Real testimonials.** The Journeys page explains that we will not publish invented ones. Replace that block the moment real ones exist. | The strongest asset the site still lacks. |
| 5 | **Google Business Profile.** Register as a **Service Area Business** (no street address required). Lagos as the service area. | For a Lagos travel agency this is worth more than the website. Do it this week. |
| 6 | **Meta Pixel + GA4.** `main.js` already fires `contact` on every WhatsApp tap and `Lead` on form submit. Just paste the tags into the `<head>`. | You cannot optimise ad spend without it. |

---

## What is deliberately NOT on this site

**The CAC certificate image.** It carries her **Tax Identification Number**, which is
impersonation material and does not belong on a public web page. The **RC number
(2000269) is published as text** instead, with a link to the CAC public register, so
anyone can verify the company independently. Same proof, no exposure.

**Invented testimonials, fake addresses, fake office hours, and any claim we cannot
substantiate.** The entire positioning of this brand is *"we are the checkable ones."*
One fabricated detail would undo all of it.

---

## Structure

```
/                     Home
/services             Hub — 6 pillars
/services/visas       Visas & Documentation
/services/flights     Flights & Travel Support
/services/tours       Tours & Getaways
/services/faith       Faith Journeys  ← highest-margin lane, watch this one
/services/purpose     Study & Medical Abroad
/services/corporate   Corporate & MICE  ← form-first, not WhatsApp-first, by design
/destinations         Destinations
/about                Mrs Demi James
/journeys             Credentials & industry presence
/faq                  FAQ (with FAQPage schema)
/contact              WhatsApp-first, form second
/thank-you            Conversion page (noindex). Fire the pixel here.
/privacy /terms       Legal
```

## WhatsApp

Every CTA deep-links to `wa.me/2347034491010` with a **pre-filled, context-aware
message**. Someone on the Visa page gets *"Hi Betini Trips, I need help with a visa
application."* already typed. This removes the "what do I even say?" hesitation and is
the single highest-leverage conversion decision on the site.

To change the number, edit one line: `var WA = '2347034491010';` in `assets/js/main.js`.

## Images

All photography has been run through a unified grade (+warmth normalised, +6% contrast,
−4% saturation, matched black point) so that AI-generated objects, licensed stock and
Mrs Demi's own phone photos read as one brand shot by one photographer.

Served as WebP with JPEG fallback, multiple widths, lazy-loaded below the fold.

## Accessibility

Skip link, visible keyboard focus, `prefers-reduced-motion` fully respected (the loader
and all scroll animations disable), 16px minimum font size, 48px minimum tap targets,
semantic landmarks, real alt text.
