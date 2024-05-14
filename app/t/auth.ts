import { auth } from "@clerk/nextjs/server";

export async function getAuthToken() {
  return (await auth().getToken({ template: "convex" })) ?? undefined;
}
