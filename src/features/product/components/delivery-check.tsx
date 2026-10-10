"use client";

import { useId, useState } from "react";
import type { DeliveryEstimate } from "@/features/delivery/estimate";

export function DeliveryCheck() {
  const id = useId();
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<DeliveryEstimate | null>(null);
  const [checking, setChecking] = useState(false);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await fetch(`/api/delivery?pin=${encodeURIComponent(pin)}`);
      setResult((await res.json()) as DeliveryEstimate);
    } catch {
      setResult({ ok: false, message: "Couldn't check delivery right now. Please try again." });
    } finally {
      setChecking(false);
    }
  }

  return (
    <form onSubmit={check} className="flex flex-col gap-2.5 border border-line bg-surface p-5">
      <label htmlFor={id} className="text-[13px] font-semibold tracking-[0.1em] uppercase">
        Check delivery
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="Enter PIN code"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
            setResult(null);
          }}
          className="h-12 min-w-0 flex-1 border border-line-strong bg-transparent px-3.5 text-sm text-fg outline-none focus:border-fg"
        />
        <button
          type="submit"
          disabled={checking}
          className="h-12 cursor-pointer bg-inverse px-[22px] text-sm font-semibold text-on-inverse disabled:opacity-60"
        >
          Check
        </button>
      </div>
      {result ? (
        <p role="status" className="m-0 text-[13px] text-muted">
          {result.message}
        </p>
      ) : null}
    </form>
  );
}
