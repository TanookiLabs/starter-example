# Project

This is a Next.js app built at the Slow Ventures Creator Fund AI Hackathon.

# Stack

- Next.js (App Router) with TypeScript
- Tailwind CSS + shadcn/ui for styling
- Auth.js (NextAuth v5) for authentication (email/password with bcrypt, JWT sessions)
- Prisma ORM for database queries (type-safe, schema defined in prisma/schema.prisma)
- PostgreSQL database (hosted on Supabase, Neon, Railway, or any provider)
- Deployed on Vercel

# Rules

- Use Server Actions for all backend logic (not API routes)
- Use Prisma (`prisma` from lib/db/prisma.ts) for all database reads and writes
- Use `auth()` from auth.ts to get the current session in Server Components and Server Actions
- Use `useSession()` from next-auth/react to get the session in Client Components
- Define all database models in prisma/schema.prisma
- After changing the schema, run `npm run db:push` to sync changes to the database
- Do not modify the Auth.js models (User, Account, Session, VerificationToken) field names
- Use shadcn/ui components for UI elements (install with: pnpm dlx shadcn@latest add <component>)
- Use Tailwind CSS for styling, never inline styles
- Always handle errors in server actions and display them to the user
- Keep API keys in .env.local, never hardcode them
- Commit frequently with descriptive messages
- When creating new pages, add them to the app/ directory following Next.js App Router conventions
- File paths are routes: app/dashboard/page.tsx = /dashboard
- All routes are protected by default via proxy.ts — new pages require login automatically
- To make a route public, add it to the `publicRoutes` array in proxy.ts
