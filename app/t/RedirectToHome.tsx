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
    console.log("Redirecting to home");
    void router.push("/");
  }, [router]);
  return null;
}
