"use client";

import { api } from "@/convex/_generated/api";
import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
import { Authenticated, ConvexReactClient, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ErrorBoundary } from "./ErrorBoundary";
import { dark } from "@clerk/themes";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  return (
    <ErrorBoundary>
      <ClerkProvider
        appearance={{ baseTheme: prefersDarkMode ? dark : undefined }}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <Authenticated>
            <StoreUserInDatabase />
          </Authenticated>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

function StoreUserInDatabase() {
  const { user } = useUser();
  const storeUser = useMutation(api.users.store);
  useEffect(() => {
    void storeUser();
  }, [storeUser, user?.id]);
  return null;
}
