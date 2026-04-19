# TransitPulse 🚌
https://hack-psi-ten.vercel.app/
> Real-time college bus tracking that stays accurate even when the network doesn't.

## Hackathon Track B — Resilient Public Transport Tracking System

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS v3, Custom CSS |
| Animation | Framer Motion |
| Routing | React Router v6 |
| Icons | Lucide React |
| 3D Scene | Spline (iframe embed) |

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, features, testimonials, CTA |
| `/tracker` | Live map with animated bus markers and ETA sidebar |
| `/features` | How-it-works flow + feature grid + 3D Spline scene |
| `/analytics` | Charts: delay by hour, on-time %, ML model MAE |
| `/driver` | Driver dashboard with offline buffer simulation |

---

## Components Used

All from the component library provided:

- `MagneticDock` — magnetic hover dock in CTA section
- `SparklesText` — animated sparkle text for headlines  
- `Footer` — animated footer with link sections
- `DesertDrift` — Spline 3D iframe embed on Features page
- `FeaturesSection` — feature card grid (custom, adapted from features-10)

---

## Hackathon Deliverables Mapping

| Requirement | Implementation |
|---|---|
| Adaptive Update Frequency | `TrackerPage` network mode simulator (WebSocket → SSE → polling) |
| Sparse Update Handling | Interpolation engine concept shown in Tracker + Features page |
| Predictive Smoothing | Catmull-Rom described + animated bus trail on map |
| ML ETA Prediction | RandomForest described with confidence band in ETA cards |
| Store-and-Forward | `DriverPage` IndexedDB offline buffer with sync simulation |

---

## Project Structure

```
src/
├── components/
│   ├── blocks/          # Page-level sections
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   └── FeaturesSection.tsx
│   └── ui/              # Reusable UI components
│       ├── magnetic-dock.tsx
│       ├── sparkles-text.tsx
│       ├── footer-section.tsx
│       └── desert-drift.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── TrackerPage.tsx
│   ├── FeaturesPage.tsx
│   ├── AnalyticsPage.tsx
│   └── DriverPage.tsx
├── lib/
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## Design System

- **Primary**: Teal `#14b8a6`
- **Background**: Navy `#0a0f1e`
- **Fonts**: Syne (display), Plus Jakarta Sans (body), JetBrains Mono (code)
- **Theme**: Dark, glassmorphism, grid overlay, subtle glow effects

---

Built for Hackathon Track B · TransitPulse © 2025
