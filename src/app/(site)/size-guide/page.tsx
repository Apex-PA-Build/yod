import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SizeGuideSection } from "@/features/product";

export const metadata: Metadata = {
  title: "Size guide",
  description: "Garment measurements and fabric specs for YOD drop shoulder tees, in cm and inches.",
};

export default function SizeGuidePage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Size guide" }]} />
      {/* Store-wide chart. Product pages show each tee's own measurements when they're set. */}
      <SizeGuideSection measurements={null} as="h1" />
      <div className="container-page max-w-3xl pb-24 text-[15px] leading-relaxed text-muted">
        <p className="m-0">
          Our tees are cut oversized on purpose. Take your usual size for a relaxed drape, or one size up for
          an extra oversized look. To compare, lay a tee you love flat and measure it the same way.
        </p>
      </div>
    </>
  );
}
