import { getAuthToken } from "@/app/t/auth";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const team = await fetchQuery(
    api.users.teams.defaultToAccess,
    {},
    { token: await getAuthToken() }
  );
  if (team === null) {
    redirect("/");
  } else {
    redirect(`/t/${team.slug}`);
  }
}
