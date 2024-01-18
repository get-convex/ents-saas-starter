# SaaS Starter: Convex + TypeScript + Next.js + Clerk + Tailwind + shadcn/ui

Build your SaaS website in no time! Included:

- Realtime database for implementing your product with
  [Convex](https://convex.dev)
  - Team/organization management
- Member invite emails using [Resend](https://resend.com)
- User sign-in and sign-up with [Clerk](https://clerk.com)
- Website router with [Next.js](https://nextjs.org/)
- Slick UX with [shadcn/ui](https://ui.shadcn.com/)

Check out [Convex docs](https://docs.convex.dev/home), and
[Convex Ents docs](https://labs.convex.dev/convex-ents)

## Setting up

```
npm create convex@latest -t xixixao/saas-starter
```

Then:

1. Run `npm run dev`
   - It will ask you to set up `CLERK_JWT_ISSUER_DOMAIN`, Follow steps 1 to 3 in
     the
     [Convex Clerk onboarding guide](https://docs.convex.dev/auth/clerk#get-started)
2. Follow step 3 from the
   [Clerk Next.js quickstart](https://clerk.com/docs/quickstarts/nextjs#set-environment-keys),
   setting up both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in
   your `.env.local` file

If you want to sync Clerk user data via webhooks, check out this
[example repo](https://github.com/thomasballinger/convex-clerk-users-table/).
