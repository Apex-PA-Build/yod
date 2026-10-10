import { Menu, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { CartButton } from "@/features/cart";
import { MainNav } from "./main-nav";
import { MobileMenu } from "./mobile-menu";
import { SearchBox } from "./search-box";
import { ThemeToggle } from "./theme-toggle";

const roundIcon =
  "relative grid size-11 cursor-pointer place-items-center rounded-full border border-line-strong bg-surface-3 text-fg transition-colors hover:border-fg";

export function SiteHeader() {
  return (
    <header className="relative z-10 flex container-page flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-line py-6">
      <Logo />

      <Suspense fallback={<div className="hidden h-11 lg:block" />}>
        <MainNav className="hidden lg:block" />
      </Suspense>

      <div className="flex items-center gap-3">
        <Suspense fallback={<div className="hidden h-11 w-[190px] md:block" />}>
          <SearchBox className="hidden md:flex" />
        </Suspense>
        <ThemeToggle className={roundIcon} />
        <CartButton className={roundIcon} />
        <Link
          href="/account"
          aria-label="Account"
          className="grid size-11 place-items-center rounded-full bg-inverse text-on-inverse transition-colors hover:bg-accent hover:text-on-accent"
        >
          <User className="size-[18px]" strokeWidth={2} aria-hidden />
        </Link>
        <Suspense
          fallback={
            <span className={`${roundIcon} lg:hidden`}>
              <Menu className="size-5" aria-hidden />
            </span>
          }
        >
          <MobileMenu triggerClassName={`${roundIcon} lg:hidden`} />
        </Suspense>
      </div>
    </header>
  );
}
