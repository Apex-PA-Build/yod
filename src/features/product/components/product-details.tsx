import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { storeConfig } from "@/shared/store-config";

export function ProductDetails({ description }: { description: string }) {
  const sections = [
    { title: "Description", body: description },
    {
      title: "Fabric & care",
      body: `Fabric: ${storeConfig.fabric.composition}\nWeight: ${storeConfig.fabric.gsm} GSM\nWash cold, inside out. Dry in shade. Do not tumble dry.`,
    },
    {
      title: "Shipping & returns",
      body: `Dispatched in ${storeConfig.dispatchDays} business days, delivered in ${storeConfig.deliveryWindowDays} days.\nEasy returns or size exchanges within ${storeConfig.returnWindowDays} days of delivery.`,
    },
  ];
  return (
    <Accordion type="single" collapsible defaultValue="Description" className="border-t border-line">
      {sections.map((s) => (
        <AccordionItem key={s.title} value={s.title}>
          <AccordionTrigger icon="plain" className="py-5 text-[15px] font-semibold">
            {s.title}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-sm">{s.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
