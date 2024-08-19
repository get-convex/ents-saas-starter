"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export function ProfileButton() {
  return (
    <div className="flex gap-4">
      <SignOutButton />
    </div>
  );
}

function SignOutButton() {
  const { signOut } = useAuthActions();
  return <Button onClick={() => void signOut()}>Sign out</Button>;
}
