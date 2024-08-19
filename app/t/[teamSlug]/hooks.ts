import { api } from "@/convex/_generated/api";
import { useQuery } from "convex-gold-nextjs";
import { UsePaginatedQueryResult } from "convex/react";
// import { useQuery } from "convex/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function useCurrentTeam() {
  const router = useRouter();
  const pathname = usePathname();
  const { teamSlug } = useParams();
  const teams = useQuery(api.users.teams.list);
  const currentTeam =
    teams?.find((team) => team.slug === teamSlug) ?? teams?.[0];
  useEffect(() => {
    if (currentTeam !== undefined && currentTeam.slug !== teamSlug) {
      router.push(
        `/t/${currentTeam.slug}/${pathname.split("/").slice(3).join("/")}`,
      );
    }
  }, [currentTeam, pathname, router, teamSlug]);
  return currentTeam;
}

export function useViewerPermissions() {
  const team = useCurrentTeam();
  const permissions = useQuery(api.users.teams.members.viewerPermissions, {
    teamId: team?._id,
  });
  return permissions == null ? null : new Set(permissions);
}

export function useStaleValue<T>(value: T | undefined) {
  const stored = useRef(value);
  if (value !== undefined) {
    stored.current = value;
  }
  return { value: stored.current, stale: value !== stored.current };
}

export function useStalePaginationValue<T>(value: UsePaginatedQueryResult<T>) {
  const stored = useRef(value);
  if (value.results.length > 0 || !value.isLoading) {
    stored.current = value;
  }
  return { value: stored.current, stale: value !== stored.current };
}
