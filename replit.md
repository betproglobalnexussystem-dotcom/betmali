# Betting Platform

A sports betting application that displays live and upcoming soccer matches with odds from external APIs.

## Overview

This is a full-stack React + Express application using:
- **Frontend**: React 18 with Vite, TailwindCSS, Radix UI components, Zustand for state management
- **Backend**: Express server serving both API and React frontend
- **Data Source**: External betting API (betmaster.com) for live match data and odds
- **Database**: Firebase Realtime Database (configured but not actively used for main data)

## Project Structure

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and state store
│   │   └── pages/        # Page components
│   └── index.html
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API routes
│   ├── storage.ts    # Data fetching from external API
│   ├── vite.ts       # Vite dev server integration
│   └── static.ts     # Static file serving for production
├── shared/           # Shared code between client/server
│   ├── firebase.ts   # Firebase configuration
│   ├── routes.ts     # API route definitions
│   └── schema.ts     # TypeScript types and Drizzle schemas
└── vite.config.ts    # Vite configuration
```

## Running the Application

The application runs on port 5000 with both frontend and API served from the same server.

**Development**: `npm run dev`
**Production**: `npm run build && npm run start`

## API Endpoints

- `GET /api/sports` - List available sports
- `GET /api/leagues` - List leagues with matches
- `GET /api/matches` - List matches with filters (isLive, isHighlight, league)
- `GET /api/matches/:id` - Get specific match details
- `POST /api/bets` - Create a new bet
- `GET /api/bets` - List all bets

## Configuration

The app uses Firebase for potential database features (configured in `shared/firebase.ts`).
The main match data comes from external API endpoints configured in `server/storage.ts`.
