import type { Gender } from "@/shared/catalog";

type CategoryContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  metaDescription: string;
  image: { src: string; alt: string; background: string; position?: string };
};

export const categoryContent: Record<Gender | "all", CategoryContent> = {
  men: {
    eyebrow: "01 / His Edit",
    title: "Men",
    subtitle: "Drop shoulder tees",
    description:
      "Relaxed, boxy and made to drape. Clean essentials and bold graphics, all in our signature drop shoulder cut.",
    metaDescription: "Men's designer drop shoulder tees: relaxed, boxy and made to drape.",
    image: {
      src: "/products/line-art-black.jpg",
      alt: "Washed black drop shoulder tee with line art print",
      background: "#2B2A28",
    },
  },
  women: {
    eyebrow: "02 / Her Edit",
    title: "Women",
    subtitle: "Drop shoulder tees",
    description:
      "Oversized drop shoulder tees for her. One relaxed silhouette, from clean essentials to bold graphics.",
    metaDescription: "Women's oversized drop shoulder tees in our signature relaxed cut.",
    image: {
      src: "/products/abstract-sage.jpg",
      alt: "Sage drop shoulder tee with an abstract print",
      background: "#5E6B4A",
    },
  },
  all: {
    eyebrow: "The Shop",
    title: "Shop",
    subtitle: "Every drop",
    description: "Designer drop shoulder tees for men and women. Pick yours and wear the drape.",
    metaDescription: "Shop every YOD designer drop shoulder tee for men and women.",
    image: {
      src: "/products/essential-bone.jpg",
      alt: "Bone drop shoulder tee on a wooden hanger",
      background: "#D9CFBF",
      position: "50% 45%",
    },
  },
};
