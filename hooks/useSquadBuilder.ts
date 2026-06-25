"use client";

import { useState, useCallback, useMemo } from "react";
import type { Player, Position } from "@/types";

const POSITION_LIMITS: Record<Position, { min: number; max: number }> = {
  GK: { min: 1, max: 1 },
  DEF: { min: 3, max: 5 },
  MID: { min: 3, max: 5 },
  FWD: { min: 1, max: 3 },
};

export function useSquadBuilder(salaryCap: number, squadSize = 11) {
  const [squad, setSquad] = useState<Player[]>([]);

  const totalCost = useMemo(
    () => squad.reduce((sum, p) => sum + parseFloat(p.price), 0),
    [squad]
  );

  const remainingBudget = salaryCap - totalCost;

  const byPosition = useCallback(
    (position: Position) => squad.filter((p) => p.position === position),
    [squad]
  );

  const canAdd = useCallback(
    (player: Player): { ok: boolean; reason?: string } => {
      if (squad.find((p) => p.id === player.id))
        return { ok: false, reason: "Already in squad" };
      if (squad.length >= squadSize)
        return { ok: false, reason: "Squad is full" };
      if (totalCost + parseFloat(player.price) > salaryCap)
        return { ok: false, reason: "Exceeds salary cap" };

      const posCount = squad.filter((p) => p.position === player.position).length;
      const limit = POSITION_LIMITS[player.position];
      if (posCount >= limit.max)
        return { ok: false, reason: `Max ${limit.max} ${player.position}` };

      return { ok: true };
    },
    [squad, squadSize, salaryCap, totalCost]
  );

  const addPlayer = useCallback(
    (player: Player) => {
      if (canAdd(player).ok) setSquad((prev) => [...prev, player]);
    },
    [canAdd]
  );

  const removePlayer = useCallback((playerId: string) => {
    setSquad((prev) => prev.filter((p) => p.id !== playerId));
  }, []);

  const validationErrors = useMemo((): string[] => {
    const errors: string[] = [];
    if (squad.length !== squadSize)
      errors.push(`Select ${squadSize - squad.length} more player(s)`);
    for (const [pos, limits] of Object.entries(POSITION_LIMITS)) {
      const count = squad.filter((p) => p.position === pos).length;
      if (count < limits.min)
        errors.push(`Need at least ${limits.min} ${pos}`);
    }
    return errors;
  }, [squad, squadSize]);

  const isValid = validationErrors.length === 0;

  return {
    squad,
    totalCost,
    remainingBudget,
    isFull: squad.length === squadSize,
    addPlayer,
    removePlayer,
    canAdd,
    isValid,
    validationErrors,
    byPosition,
    playerIds: squad.map((p) => p.id),
  };
}