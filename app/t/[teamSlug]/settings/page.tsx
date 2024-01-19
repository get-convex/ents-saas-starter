"use client";

import { useCurrentTeam, useViewerPermissions } from "@/app/t/[teamSlug]/hooks";
import { DeleteTeamDialog } from "@/app/t/[teamSlug]/settings/DeleteTeamDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function GeneralSettingsPage() {
  const team = useCurrentTeam();
  const permissions = useViewerPermissions();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (team == null || permissions == null) {
    return null;
  }

  const openDeleteTeamDialog = () => {
    setShowDeleteDialog(true);
  };
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
              <Button onClick={openDeleteTeamDialog} variant="destructive">
                Delete Personal Account
              </Button>
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
                onClick={openDeleteTeamDialog}
                variant="destructive"
              >
                Delete Team
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
      <DeleteTeamDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} />
    </>
  );
}
