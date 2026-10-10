import type { Route } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { productFaqs } from "@/content/faqs";
import type { ProductCardData } from "@/features/catalog";
import { ReviewsSection } from "@/features/reviews";
import { LABELS, NEW_DROP_TAGS } from "@/shared/catalog";
import { ProductSelectionProvider } from "../selection";
import type { ProductPageData } from "../types";
import { Benefits } from "./benefits";
import { BuyBox } from "./buy-box";
import { Comparison } from "./comparison";
import { CompleteTheDrop } from "./complete-the-drop";
import { ProductCta } from "./product-cta";
import { ProductFaq } from "./product-faq";
import { ProductGallery } from "./product-gallery";
import { SizeGuideSection } from "./size-guide-section";
import { StickyBar } from "./sticky-bar";

/** The whole product page, composed from its sections. */
export function ProductView({ data, related }: { data: ProductPageData; related: ProductCardData[] }) {
  const { product } = data;
  const gender = product.genders.length === 1 ? product.genders[0] : undefined;
  const isNew = product.tag !== undefined && NEW_DROP_TAGS.includes(product.tag);

  return (
    <ProductSelectionProvider product={product}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          ...(gender ? [{ label: LABELS.gender[gender], href: `/shop/${gender}` as Route }] : []),
          { label: product.name },
        ]}
      />
      <section className="flex container-page flex-wrap items-start gap-x-16 gap-y-10 pb-24">
        <ProductGallery isNew={isNew} />
        <BuyBox data={data} />
      </section>
      <Benefits />
      <ReviewsSection
        productId={product.id}
        productName={product.name}
        colours={product.colours}
        sizes={product.sizes}
        initialSummary={data.rating}
      />
      <SizeGuideSection measurements={product.measurements} />
      <Comparison />
      <CompleteTheDrop paired={data.pairedProduct} related={related} />
      <ProductFaq faqs={productFaqs} />
      <ProductCta />
      <StickyBar />
    </ProductSelectionProvider>
  );
}
