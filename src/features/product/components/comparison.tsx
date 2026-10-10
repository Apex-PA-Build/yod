import { SerifAccent } from "@/components/ui/section-heading";

const ROWS = [
  {
    feature: "Shoulder seam",
    drop: "Sits below the shoulder for a relaxed line",
    regular: "Sits right on the shoulder",
  },
  { feature: "Silhouette", drop: "Boxy and roomy, drapes and never clings", regular: "Closer to the body" },
  { feature: "Sleeves", drop: "Wider, falling past the shoulder", regular: "Standard, closer to the arm" },
  { feature: "Layering", drop: "Easy over or under jackets and shirts", regular: "Can bunch under layers" },
  { feature: "Best for", drop: "Streetwear, relaxed everyday looks", regular: "Classic, tucked-in looks" },
];

export function Comparison() {
  return (
    <section
      aria-labelledby="compare-title"
      className="flex container-page flex-col gap-12 border-t border-line py-24"
    >
      <h2
        id="compare-title"
        className="m-0 text-[clamp(2.75rem,6vw,6rem)] leading-[0.9] font-semibold tracking-[-0.05em] uppercase"
      >
        Drop shoulder
        <br />
        <SerifAccent>vs regular tee</SerifAccent>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-[15px]">
          <thead>
            <tr>
              <th scope="col" className="w-[22%] border-b border-line-strong px-6 py-5 text-left">
                <span className="sr-only">Feature</span>
              </th>
              <th
                scope="col"
                className="bg-accent px-6 py-5 text-left font-bold tracking-[0.06em] text-on-accent uppercase"
              >
                YOD Drop Shoulder
              </th>
              <th
                scope="col"
                className="border-b border-line-strong px-6 py-5 text-left font-semibold tracking-[0.06em] text-muted uppercase"
              >
                Regular tee
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.feature}>
                <th scope="row" className="border-b border-line px-6 py-[22px] text-left font-semibold">
                  {r.feature}
                </th>
                <td className="border-x-2 border-b border-x-accent border-b-line bg-surface-2 px-6 py-[22px]">
                  <span className="flex items-start gap-2.5">
                    <span aria-hidden className="font-bold text-accent">
                      ✓
                    </span>
                    {r.drop}
                  </span>
                </td>
                <td className="border-b border-line px-6 py-[22px] text-subtle">{r.regular}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
