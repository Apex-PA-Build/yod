import { SectionHeading, SerifAccent } from "@/components/ui/section-heading";
import { FabricSpecs } from "./fabric-specs";
import { FitDiagram } from "./fit-diagram";
import { MeasurementsTable, type Measurement } from "./measurements-table";

/** "The details, measured": fit diagram, size chart and fabric specs. */
export function SizeGuideSection({
  measurements,
  as = "h2",
}: {
  measurements: Measurement[] | null;
  as?: "h1" | "h2";
}) {
  return (
    <section
      id="size-guide"
      className="flex container-page scroll-mt-8 flex-col gap-14 border-t border-line py-24"
    >
      <SectionHeading
        as={as}
        title={
          <>
            The details,
            <br />
            <SerifAccent>measured</SerifAccent>
          </>
        }
        description="No guesswork. Exact garment measurements and fabric specs, so you know what you're getting."
      />
      <div className="flex flex-wrap items-stretch gap-x-14 gap-y-10">
        <FitDiagram />
        <div className="flex min-w-0 flex-[2_1_520px] flex-col gap-5">
          <MeasurementsTable measurements={measurements} />
          <FabricSpecs />
        </div>
      </div>
    </section>
  );
}
