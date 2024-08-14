# Spotimine: Personalized Spotify Playlist Generator

Spotimine is a Next.js application that leverages the Spotify API to create personalized playlists based on users' listening habits and preferences. This project uses TypeScript, PostgreSQL, and integrates with Spotify's authentication and data retrieval systems.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Features](#features)
3. [Setup](#setup)
4. [Pages](#pages)
5. [API Routes](#api-routes)
6. [Components](#components)
7. [Database](#database)
8. [Authentication](#authentication)
9. [Styling](#styling)
10. [Deployment](#deployment)

## Project Structure

The project follows a typical Next.js structure with additional directories for components, utilities, and API routes:

```
spotimine/
├── .next/               # Next.js build output
├── app/                 # Next.js 13+ app directory
│   ├── api/             # API routes
│   ├── stream/          # Stream page
│   ├── swipe/           # Swipe page
│   ├── topSongs/        # Top Songs page
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable React components
├── lib/                 # Library code, including Prisma client
├── prisma/              # Prisma ORM configuration and migrations
├── public/              # Static assets
├── styles/              # Global styles
├── utils/               # Utility functions
├── .env                 # Environment variables
├── next.config.mjs      # Next.js configuration
├── package.json         # Project dependencies and scripts
├── postcss.config.mjs   # PostCSS configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Features

1. Spotify Authentication
2. Top Songs Analysis
3. Personalized Playlist Generation
4. Stream Page for Playlist Playback
5. Swipe Interface for Song Discovery
6. Responsive Design with Mobile-First Approach

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Run the development server: `npm run dev`

## Pages

1. **Home (`/app/page.tsx`)**: Landing page with Spotify login
2. **Top Songs (`/app/topSongs/page.tsx`)**: Displays user's top tracks and features
3. **Stream (`/app/stream/page.tsx`)**: Playlist playback and lyrics display
4. **Swipe (`/app/swipe/page.tsx`)**: Swipe interface for discovering new tracks

## API Routes

1. **Authentication (`/app/api/auth/[...nextauth]/route.ts`)**: Handles Spotify OAuth
2. **Get Extreme Tracks (`/app/api/getExtremeTracks/route.ts`)**: Fetches tracks based on audio features
3. **Save Tracks (`/app/api/saveTracks/route.ts`)**: Saves generated playlist to user's Spotify account

## Components

- **Auth**: `SpotifyLogin.tsx`
- **Layout**: `NavigationBar.tsx`, `NavigationBarWrapper.tsx`
- **Providers**: `AuthProvider.tsx`
- **Stream**: `StreamComponent.tsx`
- **Top Songs**: `FeatureBox.tsx`
- **UI**: `Button.tsx`, `Text.tsx`

## Database

The project uses PostgreSQL with Prisma ORM. The schema is defined in `prisma/schema.prisma`.

## Authentication

Next-Auth is used for Spotify authentication. Configuration is in `/app/api/auth/[...nextauth]/route.ts`.

## Styling

The project uses a combination of Tailwind CSS and CSS Modules for styling. Global styles are in `styles/globals.css`.

## Deployment

The application is designed to be deployed on platforms like Vercel or Netlify that support Next.js applications.

For detailed deployment instructions, refer to the Next.js deployment documentation.

---

This README provides an overview of the Spotimine project. For more detailed information on specific components or features, please refer to the inline documentation within the codebase.
