import { INVITE_PARAM } from "@/app/constants";
import { getAuthToken } from "@/app/t/auth";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [INVITE_PARAM]?: number };
}) {
  const invite = searchParams[INVITE_PARAM];
  const queryString = invite !== undefined ? `?${INVITE_PARAM}=${invite}` : "";
  const token = await getAuthToken();
  const teamSlug = await fetchMutation(api.users.store, {}, { token });
  redirect(`/t/${teamSlug}${queryString}`);
}
