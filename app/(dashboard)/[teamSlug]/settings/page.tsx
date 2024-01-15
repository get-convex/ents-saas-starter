"use client";

import { Button } from "@/components/ui/button";

import { useCurrentTeam } from "@/app/(dashboard)/[teamSlug]/hooks";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const team = useCurrentTeam();
  const deleteTeam = useMutation(api.users.teams.deleteTeam);
  return (
    <>
      <h1 className="text-4xl font-extrabold my-8 text-center">
        Team Settings
      </h1>
      {team?.isPersonal ? (
        <Card>
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
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Delete Team</CardTitle>
            <CardDescription>
              Permanently delete this team. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => {
                if (team !== undefined) {
                  void deleteTeam({ teamId: team._id });
                }
              }}
              variant="destructive"
            >
              Delete Team
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
