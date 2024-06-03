"use client";

import { ErrorBoundary } from "@/app/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export function DashboardButtons() {
  return (
    <ErrorBoundary>
      <ClerkLoading>
        <div className="w-40 h-9" />
      </ClerkLoading>
      <SignedIn>
        <OpenDashboardLinkButton />
      </SignedIn>
      <SignedOut>
        <div className="flex gap-4 animate-[fade-in_0.2s]">
          <SignInButton mode="modal" forceRedirectUrl="/t">
            <Button variant="ghost">Sign in</Button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/t">
            <Button>Sign up</Button>
          </SignUpButton>
        </div>
      </SignedOut>
    </ErrorBoundary>
  );
}

function OpenDashboardLinkButton() {
  return (
    <Link href="/t" className="animate-[fade-in_0.2s]">
      <Button>Dashboard</Button>
    </Link>
  );
}
