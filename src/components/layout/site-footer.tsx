import { Mail, MessageCircle } from "lucide-react";
import type { SVGProps } from "react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { storeConfig } from "@/shared/store-config";
import { footerNav } from "./nav-links";

function Instagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

const social = [
  { href: storeConfig.contact.instagram, label: "YOD on Instagram", Icon: Instagram },
  { href: `mailto:${storeConfig.contact.email}`, label: "Email YOD", Icon: Mail },
  { href: storeConfig.contact.whatsapp, label: "Message YOD on WhatsApp", Icon: MessageCircle },
];

const footLink =
  "self-start border-b border-transparent text-[15px] text-fg-soft no-underline transition-colors hover:border-fg hover:text-fg";

async function copyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await copyrightYear();
  return (
    <footer className="flex container-page flex-col gap-14 border-t border-line bg-bg-deep pt-[72px]">
      <div className="flex flex-wrap justify-between gap-12">
        <div className="flex max-w-[360px] min-w-0 flex-[1_1_280px] flex-col gap-[18px]">
          <Logo />
          <p className="m-0 text-sm leading-[1.7] text-muted">{storeConfig.tagline}</p>
          <ul className="m-0 flex list-none gap-2.5 p-0">
            {social.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="grid size-11 place-items-center border border-line-strong text-fg transition-colors hover:bg-inverse hover:text-on-inverse"
                >
                  <Icon className="size-[18px]" strokeWidth={1.8} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav
          aria-label="Footer"
          className="grid min-w-0 flex-[2_1_480px] grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-8"
        >
          {footerNav.map((group) => (
            <div key={group.title} className="flex flex-col gap-3.5">
              <h2 className="m-0 text-[13px] font-semibold tracking-[0.08em] text-subtle uppercase">
                {group.title}
              </h2>
              {group.links.map((link) => (
                <Link key={link.label} href={link.href} className={footLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div
        aria-hidden
        className="overflow-hidden pt-2 text-center text-[clamp(120px,26vw,380px)] leading-[0.78] font-semibold tracking-[-0.06em]"
      >
        YOD
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-[22px] pb-7 text-[13px] text-subtle">
        <span>© {year} YOD. All rights reserved.</span>
        <span className="flex gap-6">
          <Link href="/privacy" className={`${footLink} text-[13px]`}>
            Privacy Policy
          </Link>
          <Link href="/terms" className={`${footLink} text-[13px]`}>
            Terms
          </Link>
        </span>
      </div>
    </footer>
  );
}
