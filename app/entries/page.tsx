"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EntriesPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/squad"); }, [router]);
  return null;
}