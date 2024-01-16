import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
        `/${currentTeam.slug}/${pathname.split("/").slice(2).join("/")}`
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
