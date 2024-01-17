"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ReactNode } from "react";

export function TeamMenu() {
  return (
    <div className="flex gap-2">
      <NavLink relativeHref="">Projects</NavLink>
      <NavLink relativeHref="/settings">Settings</NavLink>
    </div>
  );
}

function NavLink({
  relativeHref,
  children,
}: {
  relativeHref: string;
  children: ReactNode;
}) {
  const currentPath = usePathname();
  const { teamSlug } = useParams();
  const linkPath = `/t/${teamSlug as string}${relativeHref}`;
  const active =
    relativeHref === ""
      ? currentPath === linkPath
      : currentPath.startsWith(linkPath);
  return (
    <Link
      href={linkPath}
      className={cn(
        "text-sm rounded-md bg-background px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground",
        active ? "text-foreground" : "text-foreground/60"
      )}
    >
      {children}
    </Link>
  );
}
