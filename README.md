# Diet Sathi

DietSathi is a Next.js + TypeScript application for nutrition tracking, meal planning, and progress monitoring.

## Problem Statement

Despite the growing awareness of health and fitness, individuals consuming traditional Nepali diets lack accurate, culturally relevant tools to track their nutritional intake. Existing market-leading platforms predominantly feature Western cuisines, provide generic one-size-fits-all recommendations, and fail to engage users effectively, making it exceptionally difficult for the Nepali demographic to accurately track meals, stay motivated, and achieve personalized health goals.

**The Solution:**
DietSathi bridges this gap by providing a localized, AI-powered nutrition planner specifically tailored for the Nepali demographic. By integrating an authentic Nepali food database, dynamic weight-scaled AI diet generation, robust BMI monitoring, and gamified progress tracking, DietSathi empowers users with a highly personalized, culturally relevant, and engaging health-tracking experience.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- Lucide React
- Supabase

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.local.example .env.local
```

3. Add Supabase values to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

4. Start the app:

```bash
npm run dev
```

The app runs at `http://localhost:3000` by default. If port 3000 is already in use, Next.js will move to the next available port.

## Installed UI Setup

shadcn/ui has been initialized and these base components were added:

- `button`
- `card`
- `input`
- `dialog`
- `tabs`

## Next Implementation Steps

- Create Supabase project and copy keys into `.env.local`
- Create auth pages (`/login`, `/signup`)
- Add protected dashboard routes
- Create database tables (`profiles`, `meal_plans`, `food_logs`, `weight_logs`, `water_logs`)
