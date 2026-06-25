"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { entriesApi } from "@/lib/api";
import { useAuth } from "./useAuth";
import type { SubmitEntryPayload } from "@/types";

export function useUserEntries(userId: string | undefined) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["entries", "user", userId],
    queryFn: async () => {
      const token = await getToken();
      return entriesApi.getUserEntries(userId!, token);
    },
    enabled: !!userId,
  });
}

export function useEntryPlayers(entryId: string, contestId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["entries", entryId, "players", contestId],
    queryFn: async () => {
      const token = await getToken();
      return entriesApi.getEntryPlayers(entryId, contestId, token);
    },
    enabled: !!entryId && !!contestId,
  });
}

export function useSubmitEntry() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitEntryPayload) => {
      const token = await getToken();
      return entriesApi.submit(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["contests"] });
    },
  });
}