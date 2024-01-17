"use client";

import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useQuery,
} from "convex/react";
import Link from "next/link";

export function DashboardButtons() {
  return (
    <ConvexClientProvider>
      <AuthLoading>
        <Skeleton className="w-40 h-9" />
      </AuthLoading>
      <Authenticated>
        <OpenDashboardLinkButton />
      </Authenticated>
      <Unauthenticated>
        <div className="flex gap-4">
          <SignInButton mode="modal" redirectUrl="/t">
            <Button variant="ghost">Sign in</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign up</Button>
          </SignUpButton>
        </div>
      </Unauthenticated>
    </ConvexClientProvider>
  );
}

function OpenDashboardLinkButton() {
  const defaultTeamSlug = useQuery(api.users.teams.defaultToAccess);
  return (
    <Link href={`/t/${defaultTeamSlug}`}>
      <Button>Dashboard</Button>
    </Link>
  );
}
