
# ResQ AI

ResQ AI is an AI-powered emergency response platform for citizens, volunteers, and administrators.

## Overview

- Citizens can report incidents with location, images, and urgency.
- AI generates summaries, severity, priority, resource suggestions, and safety guidance.
- Volunteers receive mission opportunities and update progress.
- Admins coordinate response activity from a premium command center.

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Supabase Auth, Storage, and Realtime
- Gemini AI
- Vercel

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in the required environment variables.
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```env
NEXT_PUBLIC_APP_NAME=ResQ AI
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_key
MAPBOX_ACCESS_TOKEN=your_mapbox_token
```


