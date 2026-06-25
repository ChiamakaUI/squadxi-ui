"use client";

import { useQuery } from "@tanstack/react-query";
import { playersApi } from "@/lib/api";
import type { Position } from "@/types";

export function usePlayers(params?: {
  position?: Position;
  teamId?: string;
  league?: string;
  season?: number;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["players", params],
    queryFn: () => playersApi.list(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlayerSearch(q: string) {
  return useQuery({
    queryKey: ["players", "search", q],
    queryFn: () => playersApi.search(q),
    enabled: q.trim().length >= 2,
    staleTime: 60 * 1000,
  });
}

export function usePlayer(id: string) {
  return useQuery({
    queryKey: ["players", id],
    queryFn: () => playersApi.getById(id),
    enabled: !!id,
  });
}