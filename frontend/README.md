# JobConnect Frontend

Frontend application for JobConnect - a platform for short-term job posting and worker hiring.

## Tech Stack

- **React** (v19)
- **React Router DOM** for routing
- **Axios** for API calls
- **React Icons** for icons

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure backend is running on `http://localhost:5000`

## Running the App

**Development mode:**
```bash
npm start
```

App will run on `http://localhost:3000`

**Build for production:**
```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/       # Reusable components (Button, Input, Card, etc.)
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   ├── job/          # Job-related components
│   │   ├── application/  # Application components
│   │   └── review/       # Review components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── context/          # React Context providers
│   ├── utils/            # Helper functions
│   └── styles/           # CSS files
├── public/
└── package.json
```

## Available Routes

- `/` - Home page
- `/login` - Login page (Phase 2)
- `/register` - Register page (Phase 2)
- `/jobs` - Browse jobs (Phase 4)
- `/my-jobs` - My posted jobs (Phase 4)
- `/applications` - My applications (Phase 6)

## Design System

All design tokens are defined in `src/styles/variables.css`:
- Colors (primary, neutral, semantic)
- Spacing
- Border radius
- Shadows
- Typography

See `docs/design-specification.md` for complete design system documentation.

## Current Status

✅ Phase 1 Complete: Project setup, routing, design system
⏳ Phase 2: Authentication UI
⏳ Phase 3: Job browsing and posting UI
