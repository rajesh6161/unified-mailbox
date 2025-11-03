import { createAuthClient } from "better-auth/client";
import React from "react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut } = authClient;

export function useSession() {
  const [session, setSession] = React.useState(null);
  const [isPending, setIsPending] = React.useState(true);

  React.useEffect(() => {
    authClient.getSession().then((data) => {
      setSession(data?.data || null);
      setIsPending(false);
    });
  }, []);

  return {  session, isPending };
}