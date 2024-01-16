"use client";

import { Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RedirectToHome() {
  return (
    <Unauthenticated>
      <Redirect />
    </Unauthenticated>
  );
}

function Redirect() {
  const router = useRouter();
  useEffect(() => {
    void router.push("/");
  }, [router]);
  return null;
}
