import { cn } from "@/lib/utils";
import { AlertCircle, Inbox } from "lucide-react";

// ─── Spinner ──────────────────────────────────────────────────────────────────

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400",
        className
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <LoadingSpinner className="h-8 w-8" />
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <AlertCircle className="h-10 w-10 text-red-400" />
      <p className="text-zinc-400 text-sm max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <Inbox className="h-10 w-10 text-zinc-600" />
      <div>
        <p className="text-zinc-300 font-medium">{title}</p>
        {description && (
          <p className="text-zinc-500 text-sm mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}