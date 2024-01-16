"use client";

import { Button } from "@/components/ui/button";

import {
  useCurrentTeam,
  useViewerPermissions,
} from "@/app/(dashboard)/[teamSlug]/hooks";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

export default function GeneralSettingsPage() {
  const team = useCurrentTeam();
  const permissions = useViewerPermissions();
  const deleteTeam = useMutation(api.users.teams.deleteTeam);
  if (team == null || permissions == null) {
    return null;
  }
  console.log(permissions);

  return (
    <>
      <h1 className="text-4xl font-extrabold mt-8">
        {team.isPersonal ? <>Account Settings</> : <>Team Settings</>}
      </h1>
      <Card disabled={!permissions.has("Delete Team")}>
        {team.isPersonal ? (
          <>
            <CardHeader>
              <CardTitle>Delete Personal Account</CardTitle>
              <CardDescription>
                Permanently delete your account and leave all your teams. This
                action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="destructive">Delete Personal Account</Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Delete Team</CardTitle>
              <CardDescription>
                Permanently delete this team. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                disabled={!permissions.has("Delete Team")}
                onClick={() => {
                  void deleteTeam({ teamId: team._id });
                }}
                variant="destructive"
              >
                Delete Team
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </>
  );
}
