"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav } from "./nav-links";

function isActive(href: string, pathname: string, type: string | null) {
  const [path, query] = href.split("?");
  if (query) return pathname === path && type === new URLSearchParams(query).get("type");
  if (path === "/") return pathname === "/";
  if (path === "/shop") return pathname.startsWith("/shop") && type !== "new-drops";
  return pathname.startsWith(path ?? "");
}

export function MainNav({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const type = useSearchParams().get("type");
  return (
    <nav aria-label="Main" className={className}>
      <ul className="m-0 flex list-none flex-wrap gap-x-9 gap-y-2 p-0 text-sm font-medium">
        {mainNav.map((item) => {
          const active = isActive(item.href, pathname, type);
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn("block py-3 no-underline hover:text-accent", active && "text-accent")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
