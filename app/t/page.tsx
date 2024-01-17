import { getAuthToken } from "@/app/t/auth";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  searchParams: { showNotifs },
}: {
  searchParams: { showNotifs?: number };
}) {
  const queryString = showNotifs !== undefined ? `?showNotifs=1` : "";
  const token = await getAuthToken();
  const teamSlug = await fetchMutation(api.users.store, {}, { token });
  redirect(`/t/${teamSlug}${queryString}`);
}
