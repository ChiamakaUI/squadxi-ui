"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { useAuth } from "./useAuth";

/**
 * Returns the SquadXI database user (id + wallet_address).
 * Triggers auto-registration on first call for new users.
 * NOTE: requires GET /api/users/me on the backend — trivial to add,
 * just return req.user from the requireAuth middleware.
 */
export function useCurrentUser() {
  const { getToken, authenticated } = useAuth();

  return useQuery({
    queryKey: ["users", "me"],
    queryFn: async () => {
      const token = await getToken();
      return usersApi.me(token);
    },
    enabled: authenticated,
    staleTime: Infinity, // user record doesn't change
  });
}