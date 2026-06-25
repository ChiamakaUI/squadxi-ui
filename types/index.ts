// ─── Players ─────────────────────────────────────────────────────────────────

export type Position = "GK" | "DEF" | "MID" | "FWD";

export interface Player {
  id: string;
  api_football_id: number;
  name: string;
  position: Position;
  photo_url: string;
  price: string;
  team_name: string;
  team_logo: string;
}

export interface PlayerWithPoints extends Player {
  points: number;
}

export interface PlayersResponse {
  players: Player[];
  total: number;
  limit: number;
  offset: number;
}

// ─── Contests ─────────────────────────────────────────────────────────────────

export type ContestStatus =
  | "open"
  | "locked"
  | "scoring"
  | "settled"
  | "cancelled";

export interface Contest {
  id: string;
  name: string;
  matchweek: number;
  league: string;
  season: number;
  entry_fee: string;
  salary_cap: string;
  squad_size: number;
  max_entries: number;
  deadline: string;
  status: ContestStatus;
  entry_count: number;
  rake_pct?: number;
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

export type FixtureStatus = "NS" | "LIVE" | "HT" | "FT" | "PST" | "CANC";

export interface Fixture {
  id: string;
  api_football_id: number;
  matchweek: number;
  kickoff: string;
  status: FixtureStatus;
  home_score: number | null;
  away_score: number | null;
  home_team: string;
  home_logo: string;
  away_team: string;
  away_logo: string;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  entry_id: string;
  user_id: string;
  display_name: string;
  wallet_address: string;
  total_points: number;
  rank: number;
}

// ─── Entries ──────────────────────────────────────────────────────────────────

export interface Entry {
  id: string;
  user_id: string;
  contest_id: string;
  total_cost: string;
  total_points: number;
  rank: number | null;
  entry_tx: string | null;
  created_at: string;
}

export interface UserEntry {
  id: string;
  contest_id: string; 
  total_cost: string;
  total_points: number;
  rank: number | null;
  created_at: string;
  contest_name: string;
  matchweek: number;
  contest_status: ContestStatus;
  entry_fee: string;
}

export interface SubmitEntryPayload {
  contestId: string;
  playerIds: string[];
  entryTx?: string | null;
}

// ─── Agent ────────────────────────────────────────────────────────────────────

export type AgentRuleType =
  | "league"
  | "min_entries"
  | "max_entries"
  | "max_entry_fee"
  | "preferred_positions"
  | "avoid_teams"
  | "risk_level";

export type AgentActionType =
  | "evaluate_contest"
  | "build_squad"
  | "submit_entry"
  | "payment_sent"
  | "payment_confirmed"
  | "payment_failed"
  | "skipped_contest";

export type PayoutStatus = "pending" | "processing" | "confirmed" | "failed";

export interface AgentBudget {
  id: string;
  user_id: string;
  is_active: boolean;
  total_deposited: string;
  total_spent: string;
  max_spend_per_contest: string;
  max_contests_per_week: number;
  vault_pda: string;
  remaining: number;
}

export interface AgentRule {
  id: string;
  rule_type: AgentRuleType;
  rule_value: Record<string, unknown>;
}

export interface AgentAction {
  id: string;
  action_type: AgentActionType;
  reasoning: string;
  amount: string | null;
  tx_signature: string | null;
  status: string;
  created_at: string;
  contest_name: string;
  matchweek: number;
}

export interface AgentStatus {
  budget: AgentBudget;
  rules: AgentRule[];
  recentActions: AgentAction[];
}

export interface SetupAgentPayload {
  maxSpendPerContest: number;
  maxContestsPerWeek: number;
  vaultPda: string;
}

export interface UpdateAgentSettingsPayload {
  isActive?: boolean;
  maxSpendPerContest?: number;
  maxContestsPerWeek?: number;
  totalDeposited?: number;
  depositTx?: string;
}

export interface AddAgentRulePayload {
  budgetId: string;
  ruleType: AgentRuleType;
  ruleValue: Record<string, unknown>;
}

// ─── Assistant ────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string | unknown[];
}

export interface ChatResponse {
  reply: string;
  history: ChatMessage[];
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface CreateContestPayload {
  name: string;
  matchweek: number;
  league: string;
  season: number;
  entryFeeUsdc: number;
  rakePct: number;
  maxEntries: number;
  salaryCap: number;
  squadSize: number;
  deadlineDate: string;
}

export interface CreateContestResponse {
  contestId: string;
  onChainTx: string;
}