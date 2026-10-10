import {
  CategoryShowcase,
  ClosingCta,
  Hero,
  HomeFaq,
  HowItWorks,
  Marquee,
  StyleQuiz,
  TrendingSection,
  WearItBanner,
} from "@/features/home";
import { generalFaqs } from "@/content/faqs";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrendingSection />
      <CategoryShowcase />
      <Marquee />
      <HowItWorks />
      <StyleQuiz />
      <WearItBanner />
      <HomeFaq faqs={generalFaqs} />
      <ClosingCta />
    </>
  );
}
