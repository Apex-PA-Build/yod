import type { ReactNode } from "react";

type Props = { title: string; description?: ReactNode; footer?: ReactNode; children: ReactNode };

export function AuthCard({ title, description, footer, children }: Props) {
  return (
    <div className="flex container-page justify-center py-16">
      <div className="flex w-full max-w-[460px] flex-col gap-8 border border-line bg-surface p-[clamp(24px,5vw,44px)]">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium text-accent">Your YOD account</span>
          <h1 className="m-0 text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold tracking-[-0.04em] uppercase">
            {title}
          </h1>
          {description ? <p className="m-0 text-[15px] leading-relaxed text-muted">{description}</p> : null}
        </div>
        {children}
        {footer ? <div className="border-t border-line pt-6 text-sm text-muted">{footer}</div> : null}
      </div>
    </div>
  );
}
