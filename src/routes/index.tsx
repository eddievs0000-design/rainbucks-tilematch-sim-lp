import { createFileRoute } from "@tanstack/react-router";

import rainbucksLogo from "@/assets/rainbucks-logo";
import { OFFER_URL } from "@/lib/offer";
import { BlockGame, RatingPill, StatsRow } from "@/components/reco/BlockGame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rainbucks: Get Paid to Play Games & Surveys" },
      {
        name: "description",
        content:
          "Tap matching blocks, clear the board, and see how earning with Rainbucks works. Play games, hit milestones, get paid real cash.",
      },
      { property: "og:title", content: "Rainbucks: Get Paid to Play Games & Surveys" },
      {
        property: "og:description",
        content: "Tap matching blocks, clear the board, and see how earning with Rainbucks works.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Landing,
});

const EARNERS = [
  { flag: "🇦🇺", name: "Mia S.", amount: "$17.25" },
  { flag: "🇺🇸", name: "Jake T.", amount: "$22.80" },
  { flag: "🇨🇦", name: "Sarah L.", amount: "$14.50" },
  { flag: "🇬🇧", name: "Oliver P.", amount: "$31.10" },
  { flag: "🇮🇪", name: "Emma D.", amount: "$19.90" },
  { flag: "🇳🇿", name: "Liam K.", amount: "$26.40" },
];

function Ticker() {
  const items = [...EARNERS, ...EARNERS];
  return (
    <div className="rg-ticker">
      <div className="rg-ticker-track">
        {items.map((e, i) => (
          <div className="rg-ticker-item" key={i}>
            <span>{e.flag}</span>
            <span>{e.name} just earned</span>
            <span className="amt">{e.amount}</span>
            <span>— paid instantly</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-mist">
      <div className="rg-wrap">
        {/* ================= EARNER TICKER ================= */}
        <Ticker />

        {/* ================= HERO ================= */}
        <div className="rg-hero">
          <div className="rg-glow" />
          <div className="rg-applogo">
            <img src={rainbucksLogo} alt="Rainbucks" />
          </div>
          <RatingPill />
          <h1>
            Tap 2+ Matching Blocks
            <br />
            <span className="rg-hl">to Cash In</span>
          </h1>
          <p className="rg-sub">
            Bigger groups = bigger payouts. That's how Rainbucks works too — play games, hit milestones, get paid real
            cash.
          </p>
          <div className="rg-live">
            <span className="dot" />
            <span>1,847 people earning right now</span>
          </div>
          <a className="rg-join" href={OFFER_URL}>
            Join Now
          </a>
        </div>

        {/* ================= BALANCE + GAME + MODAL ================= */}
        <BlockGame offerUrl={OFFER_URL} />

        {/* ================= TRUST ================= */}
        <StatsRow />
        <p className="rg-disclaimer">
          Availability, rewards, and eligibility may vary by user, location, and completed activity. Results are not
          guaranteed and are based on individual participation. Earnings vary by game and milestone.
        </p>
        <div className="rg-legal">
          <span>Privacy Policy</span>
          <span>·</span>
          <span>Terms of Service</span>
        </div>

        {/* ================= PLAY NOW CTA ================= */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 8 }}>
          <div className="rg-avail">
            <span className="dot" />
            Available now — sign up for free here
          </div>
          <a className="rg-playnow" href={OFFER_URL}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Now
          </a>
        </div>
      </div>
    </div>
  );
}
