"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { BellIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";

export function Notifications() {
  const router = useRouter();
  const invites = useQuery(api.invites.list);
  const acceptInvite = useMutation(api.invites.accept);
  const noInvites = (invites ?? []).length === 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={noInvites}
          variant="secondary"
          size="icon"
          className="rounded-full relative w-8 h-8"
        >
          <BellIcon className="w-4 h-4" />
          {(invites ?? []).length > 0 ? (
            <div className="bg-destructive rounded-full w-2 h-2 absolute top-[1px] right-[1px]" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {invites?.map((invite, i) => (
          <>
            <DropdownMenuItem
              key={invite._id}
              onSelect={
                (async () => {
                  const teamSlug = await acceptInvite({ inviteId: invite._id });
                  router.push(`/${teamSlug}`);
                }) as any
              }
            >
              <div>
                <span className="font-medium">{invite.inviterEmail}</span> has
                invited you to join{" "}
                <span className="font-medium">{invite.team}</span>. Click to
                accept.
              </div>
            </DropdownMenuItem>
            {i < invites.length - 1 ? <DropdownMenuSeparator /> : null}
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
