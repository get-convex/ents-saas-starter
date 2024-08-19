import { INVITE_PARAM } from "@/app/constants";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex-gold-nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [INVITE_PARAM]?: number };
}) {
  const invite = searchParams[INVITE_PARAM];
  const queryString = invite !== undefined ? `?${INVITE_PARAM}=${invite}` : "";
  const teamSlug = await fetchQuery(api.users.teams.defaultTeamSlug);
  redirect(`/t/${teamSlug}${queryString}`);
}
