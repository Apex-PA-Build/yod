"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { cn } from "@/lib/utils";

export function SearchBox({ className }: { className?: string }) {
  const router = useRouter();
  const current = useSearchParams().get("q") ?? "";

  return (
    <form
      role="search"
      className={cn(
        "flex h-11 w-[190px] items-center gap-2.5 rounded-full border border-line-strong bg-surface-3 px-[18px] focus-within:border-fg",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q")?.toString().trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}` as Route);
      }}
    >
      <Search className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
      <label htmlFor="site-search" className="sr-only">
        Search
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        defaultValue={current}
        placeholder="Search"
        maxLength={80}
        className="w-full min-w-0 border-0 bg-transparent text-[13px] text-fg outline-none"
      />
    </form>
  );
}
