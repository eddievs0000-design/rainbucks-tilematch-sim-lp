import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Rainbucks" },
      {
        name: "description",
        content:
          "How Rainbucks handles data on this page: what the ad measurement tag collects, who receives it, and how to opt out.",
      },
      { property: "og:title", content: "Privacy Policy — Rainbucks" },
      {
        property: "og:description",
        content: "What this page measures, who receives it, and how to opt out.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

const section = {
  marginTop: 18,
} as const;

const h2 = {
  fontSize: 16,
  fontWeight: 700 as const,
  color: "#3D2C3A",
};

const p = {
  marginTop: 6,
  fontSize: 13,
  lineHeight: 1.7,
  color: "#8A7A87",
};

function Privacy() {
  return (
    <div className="min-h-screen bg-mist">
      <div className="rg-wrap" style={{ paddingTop: 40, paddingBottom: 56 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#3D2C3A" }}>
          Privacy Policy
        </h1>
        <p style={{ ...p, marginTop: 10 }}>
          This page is a demo experience for Rainbucks. This policy covers the
          data this page itself handles when you visit it.
        </p>

        <div style={section}>
          <h2 style={h2}>What is collected</h2>
          <p style={p}>
            When this page loads, an ad measurement tag may send: the page you
            arrived from (referrer), the address and title of the page you are
            viewing, and campaign identifiers attached to the link you clicked
            (for example a campaign or traffic-source ID). The mini-game runs
            entirely in your browser — your play results and the demo balance
            are not sent anywhere.
          </p>
        </div>

        <div style={section}>
          <h2 style={h2}>Who receives it</h2>
          <p style={p}>
            This data goes to ClickFlare, the ad tracking platform used for
            Rainbucks advertising (endpoint: trk.join.mobilerwrds.com), and to
            the advertising partners running Rainbucks campaigns through it.
          </p>
        </div>

        <div style={section}>
          <h2 style={h2}>What it is used for</h2>
          <p style={p}>
            Measuring which ad clicks bring visitors to this page, counting
            sign-up conversions, and optimizing ad campaigns (for example,
            deciding which ads and audiences perform better).
          </p>
        </div>

        <div style={section}>
          <h2 style={h2}>Where this applies</h2>
          <p style={p}>
            The measurement tag is not loaded for visitors in regions where
            websites must obtain consent before ad tracking (including the
            EU/EEA, the United Kingdom, and Switzerland). If your location
            cannot be determined, the tag is not loaded either.
          </p>
        </div>

        <div style={section}>
          <h2 style={h2}>Your choices</h2>
          <p style={p}>
            You can prevent this measurement by blocking requests to
            trk.join.mobilerwrds.com in your browser settings or with a
            content-blocking extension. Clicking "Play Now" or "Start Earning
            for Real" takes you to the Rainbucks offer, which has its own
            privacy policy that applies there.
          </p>
        </div>

        <div style={{ ...section, textAlign: "center" }}>
          <Link
            to="/"
            style={{ fontSize: 13, fontWeight: 600, color: "#3D2C3A" }}
          >
            ← Back to the game
          </Link>
        </div>
      </div>
    </div>
  );
}
