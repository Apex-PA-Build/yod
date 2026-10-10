import type { Route } from "next";

export const mainNav: { href: Route; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?type=new-drops" as Route, label: "New Drops" },
  { href: "/contact", label: "Contact Us" },
];

export const footerNav: { title: string; links: { href: Route; label: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { href: "/shop/men" as Route, label: "Men" },
      { href: "/shop/women" as Route, label: "Women" },
      { href: "/shop?type=new-drops" as Route, label: "New Drops" },
      { href: "/#trending" as Route, label: "Trending" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/size-guide", label: "Size Guide" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns & Exchanges" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact Us" },
      { href: "/track-order", label: "Track Order" },
    ],
  },
];
