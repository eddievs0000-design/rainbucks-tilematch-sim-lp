# FreeCash LP & Agree

Build a mobile-first single-page marketing site for Reco Social, then a qualification page. Two routes total: / (landing page) and /agree (terms page). /agree is only reached by clicking the CTA on /. Pure client-side React + Vite + TypeScript + Tailwind CSS + framer-motion + lucide-react. No backend, no auth.

Brand visual language

Aesthetic: Light, airy, premium consumer app. Soft periwinkle-lavender full-bleed background (#EEEDF8). Clean white cards. NOT dark, NOT neon, NOT glassmorphism.

Logo: https://recosocial.com/_next/image?url=%2FLogo%20-%20Horizontal.svg&w=256&q=75 — render as <img> in a white rounded-2xl shadow-sm pill container, ~120px wide.

Colors (Tailwind theme extend):

ink: #1A1714 — primary text

paper: #FFFFFF — card surface

mist: #EEEDF8 — page background

earn: #13C06A — payout figures, selected states, live counter

earn-press: #0FA459 — hover earn

live: #FF5A3C — pulsing dot only

brand: #3D52F5 — CTAs, eyebrows, italic accents, links

line: #E0DDD6 — hairline borders

muted: #76726A — captions

Typography (Google Fonts):

Headlines: Bricolage Grotesque (600–700). Tight leading (leading-[1.05]), negative tracking (tracking-[-0.02em]), ~36–44px H1 on mobile.

Body/UI: Plus Jakarta Sans (400/500/600). 16–17px, leading-relaxed.

Money figures: font-variant-numeric: tabular-nums.

Do NOT use: dark backgrounds, gradient blobs, glassmorphism, neon glow, confetti, parallax, emoji as functional icons.

Route 1 — / Landing page

Max-width 440px centered. Full mist background. No progress header.

Top bar:

Logo image (left, white pill container)

Right: pulsing green dot + animated live user counter (fluctuates randomly every ~2.8s around ~4,092)

Hero:

Headline: Get Paid For Testing Apps & Games — "Apps & Games" in brand blue

Subhead: Play mobile games you'd play anyway and unlock real cash rewards — redeem via PayPal, bank transfer, Visa prepaid, or 200+ gift cards.

Trust pill (white card, small): Shield lucide icon + Real cash — not in-game lives or boosters.

Primary CTA button: Sign up free → (brand blue, full-width, rounded-xl) — navigates to /agree

Below CTA, three inline checkmarks (earn green Check icons): 100% free to join · Real-world rewards · 60-second signup

Trustpilot row: Star icons + Excellent + 4.5/5 + 274,977 reviews on Trustpilot (muted, small)

Earnings Calculator (white card, rounded-2xl, soft shadow):

Heading: See what you could earn back — "earn back" in brand blue

Subhead: Drag the slider — based on real average payouts on in-game milestones.

Two stat chips side by side:

YOU SPEND → dollar amount (slider value, $20–$200)

YOU EARN → 8× result in earn green, large, tabular numerals

Styled range slider: brand blue gradient track, glowing blue thumb

Earning Journey (white card, rounded-2xl):

Eyebrow: YOUR EARNING JOURNEY (brand blue, uppercase tracked)

Step 1: Download & Sign Up to Start Earning — Available on iOS & Android – Takes less than 60 seconds

Step 2: Navigate to Your Wallet & Pick a Game — Sign in, tap the wallet icon, and choose from games, videos, or surveys to start earning instantly.

Step 3: Cash Out Your Earnings — Instant Payouts: PayPal, CashApp, Venmo, Crypto & Wire

Each step: numbered circle (brand blue) + bold title + body text. Stagger-revealed on mount.

Reviews carousel (auto-scrolling marquee):

Heading: Everyone's talking about us — "talking" in brand blue

Trustpilot row repeated

Seamless horizontal marquee (duplicated items), pauses on hover. Masked fade edges left/right.

8 white review cards (rounded-2xl, shadow-sm), each: 5 gold stars + name + quote:

Darakhshan J. — Amazing platform to earn cash! By far the best site I've ever used. Easy to use, wide variety of tasks and payouts are super fast. Totally legit.

Sophia L. — Honestly addicted now. The game offers are the best part — I'd be playing them anyway and getting paid for it feels like cheating.

Emma K. — I'm a stay-at-home mom and this gives me a little extra spending money every week. Super easy to use, no shady stuff. 10/10 recommend.

Olivia B. — I put in $35 and made $80 in my first weekend just doing surveys and trying a couple apps. The payout options are great — I went with the Target gift card.

Madison W. — Way better than the other rewards apps I've used. Offers actually credit when they say they will, and support replied within an hour when I had a question.

Ashley R. — I was skeptical at first but cashed out $142 to PayPal in my first week. I only invested $74. Honestly the easiest money I've made on my phone. Already told my sister.

Priya S. — Love this! I do offers while watching Netflix and it just adds up. Got an Amazon gift card last night within minutes of redeeming. So smooth.

Jessica M. — Finally something that actually pays out. I've tried so many of these apps and most are scams — this one is the real deal. Venmo cashout was instant.

Activation notice (white card, rounded-2xl):

Yellow IMPORTANT badge top-right of card

Lock lucide icon + ACTIVATION REQUIRED in brand blue, bold

Body: New users: Complete 2 quick offers to unlock full access and start earning — "2 quick offers" in earn green, bold

Footer CTA section:

Heading: Ready to start earning? — "start earning?" in brand blue

Subhead: Join a community of users earning online — start in 20 seconds.

CTA button: Create free account → — navigates to /agree

Disclaimer (muted, tiny): 18+ only. Rewards & payouts subject to T&Cs. Not affiliated with Apple, Google or any advertised brand.

Footer stats bar: 10M+ Users · $50M+ Paid Out · 🇺🇸 US (centered, muted, small)

ClickFlare script in <head>: inject <script src="https://cf.mobilerwrds.com/js/6a2b447d62f26b00128a77bc.js"></script>

Route 2 — /agree Terms & qualification page

No back button needed. Max-width 440px centered. Same mist background.

Logo at top (same white pill)

Eyebrow: THE HONEST PART (brand blue, uppercase tracked)

H1: Three things to agree on first.

Subhead: No fine print, no surprises — just how earning actually works here.

Birthdate selector (white card, rounded-2xl, above checkboxes):

Label: Your date of birth (muted, small)

Native <input type="date"> styled to brand

If age < 18: prominent modal overlay — white card, brand blue warning icon, bold: Reco Social is strictly for 18 and older. + close button. Closing lets them change date but doesn't clear it. CTA stays disabled while age < 18.

Three TermCheck rows (single white card, rounded-2xl, rows separated by line hairlines). Each row: toggle/checkbox animates check in on select:

I understand the biggest rewards often require making in-app purchases inside the games — that's part of how I earn.

I'll only download games I actually intend to play. No installing just to bounce.

If I earn by posting content on Reco, I'll keep it high-quality and real — no spam.

Sticky bottom CTA: Create my account → — disabled (muted, non-interactive) until all 3 toggled AND age ≥ 18. On click: window.open('https://start.mobilerwrds.com/cf/click/1', '_blank').

Interactions & motion

Live user counter: random ±1–3 fluctuation every ~2.8s, smooth transition

Earnings slider: real-time 8× multiplication, both stat chips update instantly

Reviews marquee: CSS translateX loop, seamless, pauses on hover

CTA buttons: scale 0.97 on press; arrow icon on primary CTA bounces horizontally on hover

Page entrance on both routes: staggered fade-up (each section ~12px translateY, ~400ms, ~70ms stagger), framer-motion variants

TermCheck: check icon animates in (scale + opacity) on toggle

Respect prefers-reduced-motion: disable transforms, render final states instantly

rounded-2xl cards, rounded-xl buttons throughout

Acceptance criteria

No console errors, no dead routes

/ CTA navigates to /agree

/agree CTA disabled until all 3 checked + valid age ≥ 18; on click opens outbound link in new tab

Age < 18 triggers modal; closing modal lets user re-select date

Fully responsive, flawless at 390px, graceful on desktop

Keyboard accessible throughout

Ships polished and intentional

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/073e15c8-b4d9-4e16-bea9-882fbc226c51).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
