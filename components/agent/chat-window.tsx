// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Send, Bot, User, Loader2 } from "lucide-react";
// import { assistantApi } from "@/lib/api";
// import { useAuth } from "@/hooks/useAuth";
// import type { ChatMessage } from "@/types";
// import { cn } from "@/lib/utils";

// export function ChatWindow() {
//   const { getToken } = useAuth();
//   const [history, setHistory] = useState<ChatMessage[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [history, loading]);

//   const send = async () => {
//     const message = input.trim();
//     if (!message || loading) return;

//     setInput("");
//     setError(null);
//     setLoading(true);

//     // Optimistically add the user message
//     const optimisticHistory: ChatMessage[] = [
//       ...history,
//       { role: "user", content: message },
//     ];
//     setHistory(optimisticHistory);

//     try {
//       const token = await getToken();
//       const res = await assistantApi.chat(message, history, token);
//       setHistory(res.history);
//     } catch (e) {
//       setError("Something went wrong. Try again.");
//       // Roll back optimistic message
//       setHistory(history);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKey = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       send();
//     }
//   };

//   const visibleMessages = history.filter(
//     (m) => m.role === "user" || m.role === "assistant"
//   );

//   return (
//     <div className="flex flex-col h-full">
//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-4 min-h-0">
//         {visibleMessages.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
//             <div className="h-14 w-14 rounded-full bg-emerald-500/15 flex items-center justify-center">
//               <Bot className="h-7 w-7 text-emerald-400" />
//             </div>
//             <div>
//               <p className="text-white font-semibold">AI Squad Assistant</p>
//               <p className="text-zinc-500 text-sm mt-1 max-w-xs">
//                 Ask me to help build a squad, find players, or explain the scoring rules.
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-2 justify-center mt-2">
//               {PROMPTS.map((p) => (
//                 <button
//                   key={p}
//                   onClick={() => setInput(p)}
//                   className="text-xs rounded-full border border-zinc-700 px-3 py-1.5 text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
//                 >
//                   {p}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ) : (
//           visibleMessages.map((msg, i) => (
//             <ChatBubble key={i} message={msg} />
//           ))
//         )}

//         {loading && (
//           <div className="flex items-center gap-2 text-zinc-500 text-sm">
//             <div className="h-8 w-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
//               <Bot className="h-4 w-4 text-emerald-400" />
//             </div>
//             <div className="flex items-center gap-1.5">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               <span>Thinking…</span>
//             </div>
//           </div>
//         )}

//         {error && (
//           <p className="text-xs text-red-400 text-center">{error}</p>
//         )}

//         <div ref={bottomRef} />
//       </div>

//       {/* Input */}
//       <div className="border-t border-zinc-800 pt-4">
//         <div className="flex gap-2 items-end">
//           <textarea
//             rows={1}
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKey}
//             placeholder="Ask about players, strategy, scoring…"
//             className="flex-1 resize-none rounded-xl border border-zinc-800 bg-zinc-800/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-h-32"
//             style={{ minHeight: "44px" }}
//           />
//           <button
//             onClick={send}
//             disabled={!input.trim() || loading}
//             className={cn(
//               "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
//               input.trim() && !loading
//                 ? "bg-emerald-500 hover:bg-emerald-600 text-white"
//                 : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
//             )}
//           >
//             <Send className="h-4 w-4" />
//           </button>
//         </div>
//         <p className="text-xs text-zinc-600 mt-2">
//           Responses may take 5–15 seconds while the assistant queries players and contests.
//         </p>
//       </div>
//     </div>
//   );
// }

// function ChatBubble({ message }: { message: ChatMessage }) {
//   const isUser = message.role === "user";
//   const text = typeof message.content === "string"
//     ? message.content
//     : message.content
//         .filter((c: any) => c.type === "text")
//         .map((c: any) => c.text)
//         .join("\n");

//   return (
//     <div className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}>
//       {!isUser && (
//         <div className="h-8 w-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
//           <Bot className="h-4 w-4 text-emerald-400" />
//         </div>
//       )}
//       <div
//         className={cn(
//           "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
//           isUser
//             ? "bg-emerald-500 text-white rounded-tr-sm"
//             : "bg-zinc-800 text-zinc-100 rounded-tl-sm"
//         )}
//       >
//         {text}
//       </div>
//       {isUser && (
//         <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
//           <User className="h-4 w-4 text-zinc-300" />
//         </div>
//       )}
//     </div>
//   );
// }

// const PROMPTS = [
//   "Build me a squad for Matchweek 1",
//   "Who are the best value defenders?",
//   "Explain the scoring system",
// ];

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Bot, User, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { assistantApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

// ─── Squad extraction ─────────────────────────────────────────────────────────

function isUUID(s: unknown): s is string {
  if (typeof s !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

/**
 * Finds the last `validate_squad` tool call in the history, matches its
 * tool_result by tool_use_id, parses the JSON, and extracts player IDs
 * from the `players` array. Also reads contest_id from the tool's input.
 *
 * This avoids picking up player IDs from position-search results, which
 * would accumulate far more than 11 players.
 */
function extractSquadFromHistory(
  history: ChatMessage[]
): { contestId: string | null; playerIds: string[] } | null {
  // ── 1. Find the last validate_squad tool_use call ─────────────────────────
  let validateToolUseId: string | null = null;
  let contestId: string | null = null;

  for (const msg of history) {
    if (msg.role !== "assistant") continue;
    const content = Array.isArray(msg.content) ? msg.content : [];
    for (const block of content as any[]) {
      if (block?.type === "tool_use" && block.name === "validate_squad") {
        validateToolUseId = block.id ?? null;
        if (isUUID(block.input?.contest_id)) {
          contestId = block.input.contest_id;
        }
        // Keep iterating — we want the LAST one
      }
    }
  }

  if (!validateToolUseId) return null;

  // ── 2. Find the tool_result that matches that tool_use_id ─────────────────
  for (const msg of history) {
    if (msg.role !== "user") continue;
    const content = Array.isArray(msg.content) ? msg.content : [];
    for (const block of content as any[]) {
      if (block?.type !== "tool_result") continue;
      if (block.tool_use_id !== validateToolUseId) continue;

      // ── 3. Parse the result JSON ──────────────────────────────────────────
      let data: unknown;
      try {
        const raw =
          typeof block.content === "string"
            ? block.content
            : Array.isArray(block.content)
            ? block.content[0]?.text ?? ""
            : "";
        data = JSON.parse(raw);
      } catch {
        return null;
      }

      if (!data || typeof data !== "object") return null;
      const d = data as Record<string, any>;

      // ── 4. Extract player IDs from the players array ──────────────────────
      const players: any[] = d.players ?? d.squad ?? d.selected_players ?? [];
      const ids = players
        .map((p) => (typeof p === "string" ? p : p?.id))
        .filter(isUUID);

      // Also try to grab contest_id from the result if not already found
      if (!contestId && isUUID(d.contest_id)) contestId = d.contest_id;
      if (!contestId && isUUID(d.id) && d.entry_fee !== undefined) contestId = d.id;

      if (ids.length >= 11) {
        return { contestId, playerIds: ids.slice(0, 11) };
      }

      return null; // Found the result block but not enough players
    }
  }

  return null;
}

// ─── Chat window ──────────────────────────────────────────────────────────────

export function ChatWindow() {
  const { getToken } = useAuth();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const squadSuggestion = useMemo(
    () => extractSquadFromHistory(history),
    [history]
  );

  const useSquadUrl = useMemo(() => {
    if (!squadSuggestion) return null;
    const { contestId, playerIds } = squadSuggestion;
    const params = `players=${playerIds.join(",")}`;
    if (contestId) return `/contests/${contestId}/enter?${params}`;
    return `/contests?${params}`;
  }, [squadSuggestion]);

  const send = async () => {
    const message = input.trim();
    if (!message || loading) return;

    setInput("");
    setError(null);
    setLoading(true);

    const optimistic: ChatMessage[] = [
      ...history,
      { role: "user", content: message },
    ];
    setHistory(optimistic);

    try {
      const token = await getToken();
      const res = await assistantApi.chat(message, history, token);
      setHistory(res.history);
    } catch {
      setError("Something went wrong. Try again.");
      setHistory(history);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const visible = history.filter(
    (m) => m.role === "user" || m.role === "assistant"
  );

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-4 min-h-0">
        {visible.length === 0 ? (
          <EmptyState onPrompt={setInput} />
        ) : (
          visible.map((msg, i) => <ChatBubble key={i} message={msg} />)
        )}

        {loading && (
          <div className="flex items-center gap-2.5 text-zinc-500 text-sm">
            <BotAvatar />
            <div className="flex items-center gap-1.5">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking…</span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}

        {/* Squad suggestion banner */}
        {squadSuggestion && useSquadUrl && !loading && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Squad ready</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {squadSuggestion.contestId
                  ? "The assistant has built a full 11-player squad for this contest."
                  : "Squad built — pick a contest to enter it."}
              </p>
            </div>
            <Link
              href={useSquadUrl}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-bold text-white transition-colors"
            >
              Use this squad
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 pt-4">
        <div className="flex gap-2 items-end">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about players, strategy, scoring…"
            className="flex-1 resize-none rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-h-32"
            style={{ minHeight: "44px" }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className={cn(
              "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              input.trim() && !loading
                ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                : "bg-white/5 text-zinc-600 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-zinc-700 mt-2">
          Responses may take 5–15 seconds while the assistant queries players and contests.
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BotAvatar() {
  return (
    <div className="h-8 w-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
      <Bot className="h-4 w-4 text-emerald-400" />
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const text =
    typeof message.content === "string"
      ? message.content
      : (message.content as any[])
          .filter((c: any) => c.type === "text")
          .map((c: any) => c.text)
          .join("\n");

  if (!text.trim()) return null;

  return (
    <div className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}>
      {!isUser && <BotAvatar />}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-emerald-500 text-white rounded-tr-sm"
            : "bg-white/[0.06] text-zinc-100 rounded-tl-sm"
        )}
      >
        {text}
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
          <User className="h-4 w-4 text-zinc-300" />
        </div>
      )}
    </div>
  );
}

function EmptyState({ onPrompt }: { onPrompt: (p: string) => void }) {
  const PROMPTS = [
    "Build me a squad for Matchweek 1",
    "Who are the best value defenders?",
    "Explain the scoring system",
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
      <div className="h-14 w-14 rounded-full bg-emerald-500/15 flex items-center justify-center">
        <Bot className="h-7 w-7 text-emerald-400" />
      </div>
      <div>
        <p className="text-white font-semibold">AI Squad Assistant</p>
        <p className="text-zinc-500 text-sm mt-1 max-w-xs">
          Ask me to help build a squad, find players, or explain the scoring rules.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => onPrompt(p)}
            className="text-xs rounded-full border border-white/10 px-3 py-1.5 text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// "use client";

// import { useState, useRef, useEffect, useMemo } from "react";
// import { Send, Bot, User, Loader2, ArrowRight } from "lucide-react";
// import Link from "next/link";
// import { assistantApi } from "@/lib/api";
// import { useAuth } from "@/hooks/useAuth";
// import type { ChatMessage } from "@/types";
// import { cn } from "@/lib/utils";

// // ─── Squad extraction ─────────────────────────────────────────────────────────

// function isUUID(s: unknown): s is string {
//   if (typeof s !== "string") return false;
//   return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
// }

// /**
//  * Scans the full Anthropic conversation history for a complete squad suggestion.
//  * Looks in tool_use inputs (most reliable) and tool_result payloads.
//  * Returns { contestId, playerIds } if a set of 11 unique player UUIDs is found.
//  */
// function extractSquadFromHistory(
//   history: ChatMessage[]
// ): { contestId: string | null; playerIds: string[] } | null {
//   const playerIds = new Set<string>();
//   let contestId: string | null = null;

//   for (const msg of history) {
//     const content = Array.isArray(msg.content) ? msg.content : [];

//     for (const block of content as any[]) {
//       // ── Assistant tool_use calls ──────────────────────────────────────────
//       if (block?.type === "tool_use" && block.input) {
//         const input = block.input;

//         // player_ids array passed to validate_squad / submit_squad
//         if (Array.isArray(input.player_ids)) {
//           input.player_ids.forEach((id: unknown) => {
//             if (isUUID(id)) playerIds.add(id);
//           });
//         }

//         // contest_id passed to a tool
//         if (isUUID(input.contest_id)) contestId = input.contest_id;
//       }

//       // ── Tool result payloads ──────────────────────────────────────────────
//       if (block?.type === "tool_result") {
//         let data: unknown;
//         try {
//           const raw =
//             typeof block.content === "string"
//               ? block.content
//               : Array.isArray(block.content)
//               ? block.content[0]?.text ?? ""
//               : "";
//           data = JSON.parse(raw);
//         } catch {
//           continue;
//         }

//         if (!data || typeof data !== "object") continue;

//         // Array of players at root level
//         if (Array.isArray(data)) {
//           (data as any[]).forEach((item) => {
//             if (isUUID(item?.id) && item?.position) playerIds.add(item.id);
//           });
//         }

//         const d = data as Record<string, any>;

//         // Nested players / squad / recommended arrays
//         const nested = d.players ?? d.squad ?? d.recommended ?? d.selected_players;
//         if (Array.isArray(nested)) {
//           nested.forEach((item: any) => {
//             if (isUUID(item?.id) && item?.position) playerIds.add(item.id);
//           });
//         }

//         // Contest from a tool result (has entry_fee + squad_size)
//         if (isUUID(d.id) && d.entry_fee !== undefined) contestId = d.id;
//         if (isUUID(d.contest_id)) contestId = d.contest_id;
//       }
//     }
//   }

//   const ids = Array.from(playerIds);
//   // Need exactly 11 unique player UUIDs
//   if (ids.length >= 11) {
//     return { contestId, playerIds: ids.slice(0, 11) };
//   }
//   return null;
// }

// // ─── Chat window ──────────────────────────────────────────────────────────────

// export function ChatWindow() {
//   const { getToken } = useAuth();
//   const [history, setHistory] = useState<ChatMessage[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [history, loading]);

//   const squadSuggestion = useMemo(
//     () => extractSquadFromHistory(history),
//     [history]
//   );

//   const useSquadUrl = useMemo(() => {
//     if (!squadSuggestion) return null;
//     const { contestId, playerIds } = squadSuggestion;
//     const params = `players=${playerIds.join(",")}`;
//     if (contestId) return `/contests/${contestId}/enter?${params}`;
//     return `/contests?${params}`;
//   }, [squadSuggestion]);

//   const send = async () => {
//     const message = input.trim();
//     if (!message || loading) return;

//     setInput("");
//     setError(null);
//     setLoading(true);

//     const optimistic: ChatMessage[] = [
//       ...history,
//       { role: "user", content: message },
//     ];
//     setHistory(optimistic);

//     try {
//       const token = await getToken();
//       const res = await assistantApi.chat(message, history, token);
//       setHistory(res.history);
//     } catch {
//       setError("Something went wrong. Try again.");
//       setHistory(history);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKey = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       send();
//     }
//   };

//   const visible = history.filter(
//     (m) => m.role === "user" || m.role === "assistant"
//   );

//   return (
//     <div className="flex flex-col h-full">
//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-4 min-h-0">
//         {visible.length === 0 ? (
//           <EmptyState onPrompt={setInput} />
//         ) : (
//           visible.map((msg, i) => <ChatBubble key={i} message={msg} />)
//         )}

//         {loading && (
//           <div className="flex items-center gap-2.5 text-zinc-500 text-sm">
//             <BotAvatar />
//             <div className="flex items-center gap-1.5">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               <span>Thinking…</span>
//             </div>
//           </div>
//         )}

//         {error && (
//           <p className="text-xs text-red-400 text-center">{error}</p>
//         )}

//         {/* Squad suggestion banner */}
//         {squadSuggestion && useSquadUrl && !loading && (
//           <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3.5 flex items-center justify-between gap-3">
//             <div>
//               <p className="text-sm font-semibold text-white">Squad ready</p>
//               <p className="text-xs text-zinc-500 mt-0.5">
//                 {squadSuggestion.contestId
//                   ? "The assistant has built a full 11-player squad for this contest."
//                   : "Squad built — pick a contest to enter it."}
//               </p>
//             </div>
//             <Link
//               href={useSquadUrl}
//               className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-bold text-white transition-colors"
//             >
//               Use this squad
//               <ArrowRight className="h-3.5 w-3.5" />
//             </Link>
//           </div>
//         )}

//         <div ref={bottomRef} />
//       </div>

//       {/* Input */}
//       <div className="border-t border-white/5 pt-4">
//         <div className="flex gap-2 items-end">
//           <textarea
//             rows={1}
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKey}
//             placeholder="Ask about players, strategy, scoring…"
//             className="flex-1 resize-none rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-h-32"
//             style={{ minHeight: "44px" }}
//           />
//           <button
//             onClick={send}
//             disabled={!input.trim() || loading}
//             className={cn(
//               "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
//               input.trim() && !loading
//                 ? "bg-emerald-500 hover:bg-emerald-400 text-white"
//                 : "bg-white/5 text-zinc-600 cursor-not-allowed"
//             )}
//           >
//             <Send className="h-4 w-4" />
//           </button>
//         </div>
//         <p className="text-[10px] text-zinc-700 mt-2">
//           Responses may take 5–15 seconds while the assistant queries players and contests.
//         </p>
//       </div>
//     </div>
//   );
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function BotAvatar() {
//   return (
//     <div className="h-8 w-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
//       <Bot className="h-4 w-4 text-emerald-400" />
//     </div>
//   );
// }

// function ChatBubble({ message }: { message: ChatMessage }) {
//   const isUser = message.role === "user";
//   const text =
//     typeof message.content === "string"
//       ? message.content
//       : (message.content as any[])
//           .filter((c: any) => c.type === "text")
//           .map((c: any) => c.text)
//           .join("\n");

//   if (!text.trim()) return null;

//   return (
//     <div className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}>
//       {!isUser && <BotAvatar />}
//       <div
//         className={cn(
//           "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
//           isUser
//             ? "bg-emerald-500 text-white rounded-tr-sm"
//             : "bg-white/[0.06] text-zinc-100 rounded-tl-sm"
//         )}
//       >
//         {text}
//       </div>
//       {isUser && (
//         <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
//           <User className="h-4 w-4 text-zinc-300" />
//         </div>
//       )}
//     </div>
//   );
// }

// function EmptyState({ onPrompt }: { onPrompt: (p: string) => void }) {
//   const PROMPTS = [
//     "Build me a squad for Matchweek 1",
//     "Who are the best value defenders?",
//     "Explain the scoring system",
//   ];
//   return (
//     <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
//       <div className="h-14 w-14 rounded-full bg-emerald-500/15 flex items-center justify-center">
//         <Bot className="h-7 w-7 text-emerald-400" />
//       </div>
//       <div>
//         <p className="text-white font-semibold">AI Squad Assistant</p>
//         <p className="text-zinc-500 text-sm mt-1 max-w-xs">
//           Ask me to help build a squad, find players, or explain the scoring rules.
//         </p>
//       </div>
//       <div className="flex flex-wrap gap-2 justify-center mt-2">
//         {PROMPTS.map((p) => (
//           <button
//             key={p}
//             onClick={() => onPrompt(p)}
//             className="text-xs rounded-full border border-white/10 px-3 py-1.5 text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
//           >
//             {p}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }