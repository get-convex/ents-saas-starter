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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function Notifications() {
  const router = useRouter();
  const invites = useQuery(api.invites.list);
  const acceptInvite = useMutation(api.invites.accept);
  const noInvites = (invites ?? []).length === 0;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showNotifs, setShowNotifs] = useState(false);
  const forceShowNotifs = searchParams.get("showNotifs") !== null;
  useEffect(() => {
    if (forceShowNotifs) {
      setShowNotifs(true);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("showNotifs");
      const newSearchParamsString = newSearchParams.toString();
      router.replace(
        `${pathname}${
          newSearchParamsString.length > 0 ? `?${newSearchParamsString}` : ""
        }`
      );
    }
  }, [forceShowNotifs, pathname, router, searchParams]);
  return (
    <DropdownMenu open={showNotifs} onOpenChange={setShowNotifs}>
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
                  router.push(`/t/${teamSlug}`);
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
