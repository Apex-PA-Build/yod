"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { authClient } from "@/lib/auth-client";
import { useRedirectTarget } from "../use-redirect-target";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[18px]">
      <path
        fill="#4285F4"
        d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z"
      />
      <path
        fill="#34A853"
        d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z"
      />
      <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7H2.1a11 11 0 0 0 0 9.9l3.7-2.7z" />
      <path
        fill="#EA4335"
        d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z"
      />
    </svg>
  );
}

/** "Continue with Google", shown only when NEXT_PUBLIC_GOOGLE_AUTH is on. */
export function GoogleButton() {
  const target = useRedirectTarget();
  const [pending, setPending] = useState(false);
  if (!env.NEXT_PUBLIC_GOOGLE_AUTH) return null;

  return (
    <>
      <Button
        type="button"
        variant="subtle"
        size="lg"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          const { error } = await authClient.signIn.social({ provider: "google", callbackURL: target });
          if (error) setPending(false);
        }}
      >
        <GoogleMark />
        Continue with Google
      </Button>
      <div className="flex items-center gap-4 text-xs tracking-[0.14em] text-subtle uppercase">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>
    </>
  );
}
