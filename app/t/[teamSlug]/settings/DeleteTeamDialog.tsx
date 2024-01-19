"use client";

import { handleFailure } from "@/app/handleFailure";
import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

export function DeleteTeamDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const deleteTeam = useMutation(api.users.teams.deleteTeam);
  const team = useCurrentTeam();
  if (team == null) {
    return null;
  }
  const handleDelete = handleFailure(async () => {
    await deleteTeam({ teamId: team._id });
    if (team.isPersonal) {
      await clerkUser!.delete();
      router.push("/");
    }
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You are about to delete{" "}
            <span className="font-semibold text-foreground">
              {team.isPersonal ? <>your personal account</> : <>{team.name}</>}
            </span>
            . This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            {team.isPersonal ? <>Delete Personal Account</> : <>Delete Team</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
