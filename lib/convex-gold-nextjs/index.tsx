"use client";

import { useAuthToken } from "@convex-dev/auth/react";
import { useQuery as convexUseQuery } from "convex-helpers/react/cache/hooks";
import { fetchQuery } from "convex/nextjs";
import { OptionalRestArgsOrSkip, useAction, useMutation } from "convex/react";
import { FunctionReference, getFunctionName } from "convex/server";
import { ServerInsertedHTMLContext } from "next/navigation";
import { use, useContext, useState } from "react";

export { useAuthActions } from "@convex-dev/auth/react";
export { useAuthToken };

export function useQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...args: OptionalRestArgsOrSkip<Query>
): Query["_returnType"] | undefined {
  const token = useAuthToken();
  return useQueryImpl(query, args[0] ?? {}, { token: token ?? undefined });
}

export { useAction, useMutation };

export function useQueryImpl<Query extends FunctionReference<"query">>(
  query: Query,
  args: Query["_args"],
  options?: { token?: string | undefined; ssr?: boolean },
): Query["_returnType"] | undefined {
  const addInsertedServerHTMLCallback = useContext(ServerInsertedHTMLContext);
  const key = JSON.stringify([getFunctionName(query), args]);
  const shouldSsr = typeof window === "undefined" && (options?.ssr ?? true);
  const [ssrPromise] = useState(() =>
    shouldSsr
      ? (async () => {
          const data = await fetchQuery(query, args, { token: options?.token });
          addInsertedServerHTMLCallback!(() => (
            <script
              dangerouslySetInnerHTML={{
                __html: `window.__convexData = window.__convexData || {}; window.__convexData[${JSON.stringify(
                  key,
                )}] = ${JSON.stringify(data)};`,
              }}
            />
          ));
          return data;
        })()
      : undefined,
  );
  const ssr = shouldSsr ? use(ssrPromise!) : (window as any).__convexData![key];
  const live = shouldSsr ? undefined : convexUseQuery(query, args);
  return live ?? ssr;
}
