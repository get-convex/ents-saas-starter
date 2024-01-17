"use client";

import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <h1 className="text-4xl font-extrabold my-8 text-center">Hello there!</h1>
      Count: {count}
      <button onClick={() => setCount((count) => count + 1)}>Click me</button>
    </main>
  );
}
