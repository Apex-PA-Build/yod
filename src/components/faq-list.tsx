import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Faq } from "@/content/faqs";

/** Accordion of questions, first one open. Used on the home, product and FAQ pages. */
export function FaqList({ faqs, numbered = true }: { faqs: Faq[]; numbered?: boolean }) {
  return (
    <Accordion type="single" collapsible defaultValue="0" className="border-t-[1.5px] border-fg">
      {faqs.map((f, i) => (
        <AccordionItem key={f.question} value={String(i)}>
          <AccordionTrigger
            index={numbered ? String(i + 1).padStart(2, "0") : undefined}
            className="text-[clamp(18px,1.6vw,22px)] font-medium tracking-[-0.01em]"
          >
            {f.question}
          </AccordionTrigger>
          <AccordionContent className={numbered ? "pr-16 pl-[54px]" : "pr-16"}>{f.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
