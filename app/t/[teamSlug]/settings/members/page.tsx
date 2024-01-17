"use client";

import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { AddMember } from "@/app/t/[teamSlug]/settings/members/AddMember";
import { MembersList } from "@/app/t/[teamSlug]/settings/members/MemberList";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MembersPage() {
  const team = useCurrentTeam();
  const router = useRouter();
  useEffect(() => {
    if (team?.isPersonal === true) {
      router.replace(`/t/${team.slug}/settings`);
    }
  }, [team, router]);
  return (
    <>
      <h1 className="text-4xl font-extrabold mt-8">Members</h1>
      <AddMember />
      <MembersList />
    </>
  );
}
