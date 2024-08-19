import { ReactNode } from "react";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import {
  fetchQuery as baseFetchQuery,
  fetchMutation as baseFetchMutation,
  fetchAction as baseFetchAction,
} from "convex/nextjs";
import { ConvexClientProvider } from "./client";

export { isAuthenticatedNextjs as isAuthenticated } from "@convex-dev/auth/nextjs/server";

export function ConvexNextjsProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsServerProvider>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}

export const fetchQuery = (async (query, args, options) => {
  return await baseFetchQuery(query, args ?? {}, {
    token: convexAuthNextjsToken(),
    ...options,
  });
}) as typeof baseFetchQuery;

export const fetchMutation = (async (mutation, args, options) => {
  return await baseFetchMutation(mutation, args ?? {}, {
    token: convexAuthNextjsToken(),
    ...options,
  });
}) as typeof baseFetchMutation;

export const fetchAction = (async (action, args, options) => {
  return await baseFetchAction(action, args ?? {}, {
    token: convexAuthNextjsToken(),
    ...options,
  });
}) as typeof baseFetchAction;
