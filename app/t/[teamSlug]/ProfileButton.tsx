"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { UserButton } from "@clerk/clerk-react";
import { AuthLoading, Authenticated } from "convex/react";

export function ProfileButton() {
  return (
    <div className="flex gap-4">
      <AuthLoading>
        <Skeleton className="w-8 h-8 rounded-full" />
      </AuthLoading>
      <Authenticated>
        <UserButton afterSignOutUrl="/" />
      </Authenticated>
    </div>
  );
}
