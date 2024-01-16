"use client";

import { AddMember } from "@/app/(dashboard)/[teamSlug]/settings/members/AddMember";
import { MembersList } from "@/app/(dashboard)/[teamSlug]/settings/members/MemberList";

export default function MembersPage() {
  return (
    <>
      <h1 className="text-4xl font-extrabold mt-8">Members</h1>
      <AddMember />
      <MembersList />
    </>
  );
}
