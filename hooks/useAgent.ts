
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { agentApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type {
  SetupAgentPayload,
  UpdateAgentSettingsPayload,
  AddAgentRulePayload,
} from "@/types";

export function useAgentStatus() {
  const { getToken, authenticated } = useAuth();
  return useQuery({
    queryKey: ["agent", "status"],
    queryFn: async () => {
      const token = await getToken();
      return agentApi.getStatus(token);
    },
    enabled: authenticated,
    retry: false,
  });
}

export function useSetupAgent() {
  const { getToken } = useAuth();
  // No onSuccess invalidation — the wizard controls when to refetch
  // to prevent the query from bypassing wizard steps 2–4
  return useMutation({
    mutationFn: async (payload: SetupAgentPayload) => {
      const token = await getToken();
      return agentApi.setup(payload, token);
    },
  });
}

export function useUpdateAgentSettings() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateAgentSettingsPayload) => {
      const token = await getToken();
      return agentApi.updateSettings(payload, token);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agent"] }),
  });
}

export function useAddAgentRule() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddAgentRulePayload) => {
      const token = await getToken();
      return agentApi.addRule(payload, token);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agent"] }),
  });
}

export function useDeleteAgentRule() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ruleId, budgetId }: { ruleId: string; budgetId: string }) => {
      const token = await getToken();
      return agentApi.deleteRule(ruleId, budgetId, token);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agent"] }),
  });
}