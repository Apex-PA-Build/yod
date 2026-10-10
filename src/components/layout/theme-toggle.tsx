"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={cn(className)}
    >
      <Sun className="hidden size-[17px] [[data-theme=light]_&]:block" aria-hidden />
      <Moon className="size-[17px] [[data-theme=light]_&]:hidden" aria-hidden />
    </button>
  );
}
