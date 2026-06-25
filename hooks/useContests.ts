"use client";

import { useQuery } from "@tanstack/react-query";
import { contestsApi } from "@/lib/api";

export function useContests() {
  return useQuery({
    queryKey: ["contests"],
    queryFn: contestsApi.list,
    staleTime: 30 * 1000,
  });
}

export function useContest(id: string) {
  return useQuery({
    queryKey: ["contests", id],
    queryFn: () => contestsApi.getById(id),
    enabled: !!id,
  });
}

export function useContestFixtures(id: string) {
  return useQuery({
    queryKey: ["contests", id, "fixtures"],
    queryFn: () => contestsApi.getFixtures(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useContestLeaderboard(id: string) {
  return useQuery({
    queryKey: ["contests", id, "leaderboard"],
    queryFn: () => contestsApi.getLeaderboard(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}