import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const control =
  "h-12 w-full min-w-0 border border-line-strong bg-transparent px-4 text-[15px] text-fg transition-colors outline-none focus:border-fg aria-invalid:border-accent";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "h-auto min-h-32 py-3 leading-relaxed", className)} {...props} />;
}

export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(control, "cursor-pointer bg-bg pr-8", className)} {...props} />;
}

type FieldProps = {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Label, control and error message wired together for screen readers. */
export function Field({ label, htmlFor, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-semibold tracking-[0.06em] uppercase">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="m-0 text-[13px] text-subtle">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="m-0 text-[13px] font-semibold text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Props that connect a control to its Field's error message. */
export function errorProps(id: string, error?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}
