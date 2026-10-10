import type { Route } from "next";
import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { label: string; href?: Route };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-page py-[22px] text-[13px] text-subtle">
      <ol className="m-0 flex list-none flex-wrap gap-2.5 p-0">
        {items.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 ? <li aria-hidden>/</li> : null}
            <li>
              {item.href ? (
                <Link href={item.href} className="text-muted no-underline hover:text-accent">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-fg">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
