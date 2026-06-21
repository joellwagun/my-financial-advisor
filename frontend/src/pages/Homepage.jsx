// Homepage.jsx
// Landing page rebuilt using Shadcn UI components and Tailwind CSS.
// Shadcn gives us pre-built, styled components like Button, Card etc.
// Tailwind gives us utility classes like "flex", "gap-2", "text-sm" instead of inline styles.

import { useNavigate } from "react-router-dom";

// These are Shadcn components, imported from the ui folder that shadcn created
// Button : a pre-styled button.
import { Button } from "@/components/ui/button";
// Card : a pre-styled white card with border and rounded corners
import { Card, CardContent } from "@/components/ui/card";


// FeatureCard — one of the 3 
function FeatureCard({ icon, title, desc, iconBg }) {
  return (
    // Card is from Shadcn — gives us the white box with border automatically
    <Card>
      <CardContent className="p-5">
        {/* Icon circle */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-xl"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        {/* Title */}
        <p className="text-sm font-medium mb-1">{title}</p>
        {/* Description
            text-muted-foreground is a Shadcn color that adjusts for light/dark mode */}
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}

// StepCard — one of the 3 "how it works" steps
function StepCard({ number, title, desc }) {
  return (
    <div className="text-center">
      {/* Numbered circle
          bg-[#EEEDFE] — Tailwind lets you use any hex color with square brackets
          mx-auto — centers the div horizontally */}
      <div className="w-9 h-9 rounded-full bg-[#EEEDFE] text-[#534AB7] flex items-center justify-center mx-auto mb-2 text-sm font-medium">
        {number}
      </div>
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────────

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans">
      {/* ── NAVBAR ──
          flex — makes children sit side by side
          justify-between — pushes logo left, buttons right
          border-b — adds a bottom border line */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        {/* Logo + name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#EEEDFE] rounded-lg flex items-center justify-center text-lg">
            💼
          </div>
          <span className="text-sm font-medium">My Financial Advisor</span>
        </div>

        {/* Nav buttons
            Shadcn Button variants:
            default  = solid purple background
            outline  = transparent with border
            ghost    = no border, no background */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/login")}>
            Sign in
          </Button>
          <Button onClick={() => navigate("/register")}>Get started</Button>
        </div>
      </nav>

      {/* ── HERO SECTION ──
          text-center — centers all text
          py-16 — padding top and bottom (16 * 4px = 64px) */}
      <div className="text-center px-6 py-16">
        {/* Headline */}
        <h1 className="text-4xl font-medium leading-tight mb-4">
          Track your expenses,
          <br />
          effortlessly
        </h1>

        {/* Subtext
            max-w-md — limits width so text does not stretch too wide
            mx-auto — centers it */}
        <p className="text-muted-foreground text-base max-w-md mx-auto mb-6 leading-relaxed">
          Upload a receipt and let AI extract vendor, date, and amount
          automatically. See your spending at a glance.
        </p>

        {/* CTA Buttons
            size="lg" — Shadcn button size variant (sm, default, lg) */}
        <div className="flex gap-3 justify-center">
          <Button size="lg" onClick={() => navigate("/register")}>
            Get started for free
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
        </div>
      </div>

      {/* ── FEATURES SECTION ──
          grid grid-cols-3 — 3 equal columns
          gap-3 — space between cards */}
      <div className="grid grid-cols-3 gap-3 px-6 pb-12">
        <FeatureCard
          icon="📷"
          title="OCR scanning"
          desc="Take a photo of any receipt and we extract the details automatically."
          iconBg="#E1F5EE"
        />
        <FeatureCard
          icon="📊"
          title="Smart dashboard"
          desc="Visual breakdown of your spending by category and month."
          iconBg="#EEEDFE"
        />
        <FeatureCard
          icon="🤖"
          title="AI powered"
          desc="Local AI keeps your financial data private — nothing leaves your machine."
          iconBg="#FAECE7"
        />
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="border-t px-6 py-10">
        <p className="text-xs font-medium text-muted-foreground text-center uppercase tracking-widest mb-6">
          How it works
        </p>
        <div className="grid grid-cols-3 gap-6">
          <StepCard
            number="1"
            title="Upload"
            desc="Take a photo of your receipt"
          />
          <StepCard
            number="2"
            title="Extract"
            desc="AI reads vendor, date and amount"
          />
          <StepCard
            number="3"
            title="Track"
            desc="See your spending on the dashboard"
          />
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="border-t px-6 py-4 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          My Financial Advisor © 2026
        </span>
        <div className="flex gap-4">
          <span
            className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
          <span
            className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
}
