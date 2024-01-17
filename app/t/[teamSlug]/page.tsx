"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";

export default function Home() {
  const foo = useQuery(api.users.teams.defaultToAccess);
  const [count, setCount] = useState(0);
  return (
    <main>
      <h1 className="text-4xl font-extrabold my-8 text-center">
        {foo?.slug} {count}
      </h1>
      <button onClick={() => setCount((count) => count + 1)}>Click me</button>
    </main>
  );
}
