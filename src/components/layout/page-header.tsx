import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "./breadcrumb";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  /** Trail before the current page. "Home" is added automatically. */
  crumbs?: Crumb[];
  /** Label for the current page in the breadcrumb, when the title isn't plain text. */
  current: string;
  children?: ReactNode;
};

/** Breadcrumb plus the big page title used by account, checkout and content pages. */
export function PageHeader({ title, description, eyebrow, crumbs = [], current, children }: Props) {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, ...crumbs, { label: current }]} />
      <header className="flex container-page flex-wrap items-end justify-between gap-6 pt-6 pb-12">
        <div className="flex max-w-3xl flex-col gap-4">
          {eyebrow ? <span className="text-sm font-medium text-accent">{eyebrow}</span> : null}
          <h1 className="m-0 text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.92] font-semibold tracking-[-0.05em] uppercase">
            {title}
          </h1>
          {description ? (
            <p className="m-0 max-w-xl text-[15px] leading-relaxed text-muted">{description}</p>
          ) : null}
        </div>
        {children}
      </header>
    </>
  );
}
