import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUsdc(amount: string | number): string {
  return `$${Number(amount).toFixed(2)}`;
}

export function formatPoints(points: number): string {
  return points > 0 ? `+${points}` : `${points}`;
}

export function formatDeadline(deadline: string): string {
  return new Date(deadline).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeUntilDeadline(deadline: string): string {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Deadline passed";
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function isDeadlinePassed(deadline: string): boolean {
  return new Date(deadline).getTime() < Date.now();
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function positionOrder(position: string): number {
  return { GK: 0, DEF: 1, MID: 2, FWD: 3 }[position] ?? 4;
}