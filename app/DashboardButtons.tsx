import { SignInButton } from "@/app/SignInButton";
import { SignUpButton } from "@/app/SignUpButton";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "convex-gold-nextjs/server";
import Link from "next/link";

export function DashboardButtons() {
  return isAuthenticated() ? (
    <OpenDashboardLinkButton />
  ) : (
    <div className="flex gap-4 animate-[fade-in_0.2s]">
      <SignInButton />
      <SignUpButton />
    </div>
  );
}

function OpenDashboardLinkButton() {
  return (
    <Link href="/t" className="animate-[fade-in_0.2s]">
      <Button>Dashboard</Button>
    </Link>
  );
}
