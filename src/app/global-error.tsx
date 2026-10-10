"use client";

import "./globals.css";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN" data-theme="dark">
      <body className="flex min-h-dvh flex-col items-start justify-center gap-6 p-10">
        <h1 className="m-0 text-4xl font-semibold uppercase">Something went wrong</h1>
        <button
          type="button"
          onClick={reset}
          className="h-12 cursor-pointer bg-inverse px-6 font-semibold text-on-inverse"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
