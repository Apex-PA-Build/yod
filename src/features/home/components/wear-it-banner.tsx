import { RotatingBadge } from "@/components/brand/rotating-badge";
import { NewsletterForm } from "@/features/newsletter";

const reasons = [
  { title: "Designer cut", body: "Drop shoulder tees designed to drape, not cling." },
  { title: "For him & her", body: "One relaxed silhouette, styled for men and women." },
  { title: "Everyday easy", body: "Wear it loose, half-tucked or layered — it just works." },
];

export function WearItBanner() {
  return (
    <section id="act" className="px-4 pb-6 sm:px-6">
      <div className="relative flex flex-col gap-12 overflow-hidden border border-line bg-surface px-[clamp(28px,5vw,72px)] py-[clamp(48px,7vw,96px)]">
        <div className="flex flex-wrap items-end justify-between gap-10">
          <h2 className="m-0 min-w-0 flex-[1_1_560px] text-[clamp(52px,8.4vw,128px)] leading-[0.95] font-medium tracking-[-0.05em]">
            Don&apos;t just
            <br />
            scroll. <span className="text-accent">Wear it.</span>
          </h2>
          <RotatingBadge
            href="/shop"
            ringText="SHOP THE DROP - SHOP THE DROP - "
            label="Shop now"
            size={190}
          />
        </div>

        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-px overflow-hidden bg-line-strong p-0">
          {reasons.map((r, i) => (
            <li key={r.title} className="flex flex-col gap-2.5 bg-surface-2 p-7">
              <span className="text-[40px] font-medium tracking-[-0.03em] text-accent">0{i + 1}</span>
              <span className="text-lg font-semibold">{r.title}</span>
              <span className="text-sm leading-relaxed text-muted">{r.body}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <h3 className="m-0 text-[22px] font-semibold tracking-[-0.01em]">Be first to the next drop.</h3>
            <p className="m-0 text-sm text-muted">Get new drop alerts straight to your inbox.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
