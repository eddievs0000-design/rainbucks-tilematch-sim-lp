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
          "See how much you could earn. Play the mini-game — that's Rainbucks in 10 seconds: games → milestones → cash.",
      },
      { property: "og:title", content: "Rainbucks: See How Much You Could Earn" },
      {
        property: "og:description",
        content: "Play the mini-game. That's Rainbucks in 10 seconds: games → milestones → cash.",
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
            See how much you
            <br />
            could <span className="rg-hl">earn</span>
          </h1>
          <p className="rg-sub">
            Play the mini-game. That's Rainbucks in 10 seconds: games → milestones → cash.
          </p>
          <div className="rg-live">
            <span className="dot" />
            <span>1,847 people cashing out right now</span>
          </div>
          <button
            className="rg-join"
            onClick={() => {
              document.getElementById("demo-game")?.scrollIntoView({ behavior: "smooth", block: "center" });
              window.dispatchEvent(new CustomEvent("rg:start-demo"));
            }}
          >
            Play the Demo
          </button>
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
