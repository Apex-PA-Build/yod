import { storeConfig } from "@/shared/store-config";

export type Faq = { question: string; answer: string };

export const generalFaqs: Faq[] = [
  {
    question: "What is a drop shoulder tee?",
    answer:
      "A drop shoulder tee has its shoulder seam sitting lower down the arm instead of right on the shoulder. That gives it a relaxed, boxy shape that drapes rather than clings.",
  },
  {
    question: "How should a drop shoulder tee fit?",
    answer:
      "It is meant to look roomy. The shoulders sit past your natural shoulder line, the sleeves fall a little longer, and the body hangs straight and loose.",
  },
  {
    question: "What size should I choose?",
    answer:
      "Take your usual size for a relaxed drape, or go one size up for an extra oversized look. Check the size guide on each product page for exact measurements.",
  },
  {
    question: "Do you have tees for both men and women?",
    answer:
      "Yes. Every drop comes in our Men and Women ranges, so you can shop the same designs in the cut made for you.",
  },
  {
    question: "How long does delivery take?",
    answer: `Orders usually arrive within ${storeConfig.deliveryWindowDays} business days. You will get a tracking link as soon as your order ships.`,
  },
  {
    question: "Can I return or exchange my tee?",
    answer: `Yes — you can return or exchange unworn tees within ${storeConfig.returnWindowDays} days of delivery. See our Returns & Exchanges page for the full policy.`,
  },
  {
    question: "How do I care for my tee?",
    answer:
      "Wash cold, inside out, with similar colours, and dry flat or in the shade. Skip the tumble dryer to keep the shape and print looking new.",
  },
];

export const productFaqs: Faq[] = [
  {
    question: "Should I size up or down?",
    answer:
      "It is cut oversized. Take your usual size for a relaxed drape, or one size up for an extra oversized look. Compare with the measurements above if you are between sizes.",
  },
  {
    question: "Will it shrink after washing?",
    answer:
      "[Add your fabric’s shrinkage details here, e.g. pre-shrunk / bio-washed.] Wash cold and dry in shade to keep the fit.",
  },
  {
    question: "Is the fabric see-through?",
    answer: `The tee is made from ${storeConfig.fabric.gsm} GSM ${storeConfig.fabric.composition}, [add opacity details here].`,
  },
  {
    question: "Can I exchange for a different size?",
    answer: `Yes — size exchanges are accepted within ${storeConfig.returnWindowDays} days of delivery on unworn tees.`,
  },
  {
    question: "How is it packed?",
    answer: "Every tee is checked, folded and packed by our team before dispatch.",
  },
];
