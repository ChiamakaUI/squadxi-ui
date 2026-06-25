import type {
  Player,
  PlayersResponse,
  Contest,
  Fixture,
  LeaderboardEntry,
  Entry,
  UserEntry,
  PlayerWithPoints,
  SubmitEntryPayload,
  ChatMessage,
  ChatResponse,
  AgentStatus,
  SetupAgentPayload,
  UpdateAgentSettingsPayload,
  AddAgentRulePayload,
  AgentRule,
  CreateContestPayload,
  CreateContestResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// ─── Core fetch ──────────────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  token?: string;
  adminKey?: string;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, adminKey, ...init } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (adminKey) headers["x-admin-key"] = adminKey;

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

function qs(params: Record<string, string | number | undefined>): string {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined)
  ) as Record<string, string>;
  const s = new URLSearchParams(filtered).toString();
  return s ? `?${s}` : "";
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  /** Returns the SquadXI user record for the authenticated JWT. Auto-creates on first call. */
  me: (token: string) =>
    apiFetch<{ id: string; walletAddress: string }>("/api/users/me", { token }),
};

// ─── Health ───────────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => apiFetch<{ status: string; timestamp: string }>("/health"),
};

// ─── Players ─────────────────────────────────────────────────────────────────

export const playersApi = {
  list: (params?: {
    position?: string;
    teamId?: string;
    league?: string;
    season?: number;
    limit?: number;
    offset?: number;
  }) =>
    apiFetch<PlayersResponse>(
      `/api/players${qs(params as Record<string, string | number | undefined>)}`
    ),

  search: (q: string, limit?: number) =>
    apiFetch<Player[]>(`/api/players/search${qs({ q, limit })}`),

  getById: (id: string) => apiFetch<Player>(`/api/players/${id}`),
};

// ─── Contests ─────────────────────────────────────────────────────────────────

export const contestsApi = {
  list: () => apiFetch<Contest[]>("/api/contests"),

  getById: (id: string) => apiFetch<Contest>(`/api/contests/${id}`),

  getFixtures: (id: string) =>
    apiFetch<Fixture[]>(`/api/contests/${id}/fixtures`),

  getLeaderboard: (id: string, params?: { limit?: number; offset?: number }) =>
    apiFetch<LeaderboardEntry[]>(
      `/api/contests/${id}/leaderboard${qs(params as Record<string, number | undefined>)}`
    ),
};

// ─── Entries ──────────────────────────────────────────────────────────────────

export const entriesApi = {
  submit: (payload: SubmitEntryPayload, token: string) =>
    apiFetch<Entry>("/api/entries", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),

  getUserEntries: (userId: string, token: string) =>
    apiFetch<UserEntry[]>(`/api/entries/user/${userId}`, { token }),

  getEntryPlayers: (entryId: string, contestId: string, token: string) =>
    apiFetch<PlayerWithPoints[]>(
      `/api/entries/${entryId}/players?contestId=${contestId}`,
      { token }
    ),
};

// ─── Assistant ────────────────────────────────────────────────────────────────

export const assistantApi = {
  chat: (
    message: string,
    history: ChatMessage[],
    token: string
  ) =>
    apiFetch<ChatResponse>("/api/assistant/chat", {
      method: "POST",
      body: JSON.stringify({ message, history }),
      token,
    }),
};

// ─── Agent ────────────────────────────────────────────────────────────────────

export const agentApi = {
  getStatus: (token: string) =>
    apiFetch<AgentStatus>("/api/agent/status", { token }),

  setup: (payload: SetupAgentPayload, token: string) =>
    apiFetch<{ success: boolean }>("/api/agent/setup", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),

  updateSettings: (payload: UpdateAgentSettingsPayload, token: string) =>
    apiFetch<{ success: boolean }>("/api/agent/settings", {
      method: "PATCH",
      body: JSON.stringify(payload),
      token,
    }),

  addRule: (payload: AddAgentRulePayload, token: string) =>
    apiFetch<AgentRule>("/api/agent/rules", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),

  deleteRule: (ruleId: string, budgetId: string, token: string) =>
    apiFetch<{ success: boolean }>(
      `/api/agent/rules/${ruleId}?budgetId=${budgetId}`,
      { method: "DELETE", token }
    ),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  createContest: (payload: CreateContestPayload, adminKey: string) =>
    apiFetch<CreateContestResponse>("/api/admin/contests", {
      method: "POST",
      body: JSON.stringify(payload),
      adminKey,
    }),

  lockContest: (id: string, adminKey: string) =>
    apiFetch<{ success: boolean }>(`/api/admin/contests/${id}/lock`, {
      method: "POST",
      adminKey,
    }),

  scoreContest: (id: string, adminKey: string) =>
    apiFetch<{ success: boolean }>(`/api/admin/contests/${id}/score`, {
      method: "POST",
      adminKey,
    }),

  settleContest: (id: string, adminKey: string) =>
    apiFetch<{ success: boolean }>(`/api/admin/contests/${id}/settle`, {
      method: "POST",
      adminKey,
    }),

  cancelContest: (id: string, adminKey: string) =>
    apiFetch<{ success: boolean }>(`/api/admin/contests/${id}/cancel`, {
      method: "POST",
      adminKey,
    }),
};

// ─── Sync (Admin) ─────────────────────────────────────────────────────────────

export const syncApi = {
  seedSeason: (league: number, season: number, adminKey: string) =>
    apiFetch<{ success: boolean }>("/api/sync/season", {
      method: "POST",
      body: JSON.stringify({ league, season }),
      adminKey,
    }),

  syncFixtures: (league: number, season: number, adminKey: string) =>
    apiFetch<{ success: boolean }>("/api/sync/fixtures", {
      method: "POST",
      body: JSON.stringify({ league, season }),
      adminKey,
    }),

  scoreFixture: (fixtureApiId: number, adminKey: string) =>
    apiFetch<{ success: boolean }>("/api/sync/score-fixture", {
      method: "POST",
      body: JSON.stringify({ fixtureApiId }),
      adminKey,
    }),
};