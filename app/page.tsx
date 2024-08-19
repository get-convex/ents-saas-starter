import { DashboardButtons } from "@/app/DashboardButtons";
import { StickyHeader } from "@/components/layout/sticky-header";
import { Link } from "@/components/typography/link";

export default function Home() {
  return (
    <>
      <StickyHeader className="px-4 py-2">
        <div className="flex justify-between items-center">
          <span>SaaS Starter</span>
          <DashboardButtons />
        </div>
      </StickyHeader>
      <main className="container max-w-2xl flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold my-8 text-center leading-relaxed">
          Convex + Next.js + Clerk Auth SaaS Starter Template
        </h1>
        <p>
          Here you{"'"}ll do a great job selling your product through clear
          explanation and clever value proposition...
        </p>
        <hr />
        <p>
          This template includes sign-up and sign-in with{" "}
          <Link href="https://clerk.com" target="_blank">
            Clerk
          </Link>
          , and team/organization management built on{" "}
          <Link href="https://convex.dev" target="_blank">
            Convex
          </Link>{" "}
          with member invite emails using{" "}
          <Link href="https://resend.com" target="_blank">
            Resend
          </Link>
          .
        </p>
        <p>
          The frontend is powered by{" "}
          <Link href="https://nextjs.org" target="_blank">
            Next.js 14 App Router
          </Link>
          .
        </p>
        <hr />
        <p>
          Check out the{" "}
          <Link href="https://github.com/xixixao/saas-starter" target="_blank">
            project repo
          </Link>{" "}
          for more details.
        </p>
      </main>
    </>
  );
}
