"use client";

import { useRouter } from "next/navigation";
import { createContext, use, useState, type ReactNode } from "react";
import { useCartActions } from "@/features/cart";
import { MAX_QTY_PER_LINE, type Size } from "@/shared/catalog";
import type { ProductData as Product } from "./types";

export type StockLevel = { colourKey: string; size: Size; left: number | null };

type Selection = {
  product: Product;
  /** Units left for a size in the current colour: null means plenty, 0 means sold out. */
  stockLeft: (size: Size) => number | null;
  colourIndex: number;
  colour: Product["colours"][number];
  size: Size | null;
  quantity: number;
  sizeError: boolean;
  added: boolean;
  pending: boolean;
  setColour: (index: number) => void;
  setSize: (size: Size) => void;
  setQuantity: (quantity: number) => void;
  /** Flags the missing size and scrolls the size picker into view. */
  promptForSize: () => void;
  /** Adds the current selection. Returns false when a size is missing or the add failed. */
  addToCart: () => Promise<boolean>;
  buyNow: () => Promise<void>;
};

const SelectionContext = createContext<Selection | null>(null);

/** Colour, size and quantity shared by the gallery, buy box and sticky bar. */
export function ProductSelectionProvider({
  product,
  stock,
  children,
}: {
  product: Product;
  stock: StockLevel[];
  children: ReactNode;
}) {
  const router = useRouter();
  const { add } = useCartActions();
  const [colourIndex, setColourIndex] = useState(0);
  const [size, setSizeState] = useState<Size | null>(null);
  const [quantity, setQuantityState] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [pending, setPending] = useState(false);

  const colour = product.colours[colourIndex] ?? product.colours[0]!;

  function promptForSize() {
    setSizeError(true);
    setAdded(false);
    document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function addToCart() {
    if (!size) {
      promptForSize();
      return false;
    }
    setPending(true);
    const result = await add({ productId: product.id, colourKey: colour.key, size, quantity });
    setPending(false);
    const ok = result !== null;
    setAdded(ok);
    return ok;
  }

  const stockLeft = (s: Size) => {
    const row = stock.find((r) => r.colourKey === colour.key && r.size === s);
    return row ? row.left : 0;
  };

  const value: Selection = {
    product,
    stockLeft,
    colourIndex,
    colour,
    size,
    quantity,
    sizeError,
    added,
    pending,
    setColour: (i) => {
      setColourIndex(i);
      setAdded(false);
      // Keep the size only if it's still in stock in the new colour.
      const next = product.colours[i];
      if (size && next && stock.find((r) => r.colourKey === next.key && r.size === size)?.left === 0) {
        setSizeState(null);
      }
    },
    setSize: (s) => {
      setSizeState(s);
      setSizeError(false);
      setAdded(false);
    },
    setQuantity: (q) => {
      setQuantityState(Math.max(1, Math.min(MAX_QTY_PER_LINE, q)));
      setAdded(false);
    },
    promptForSize,
    addToCart,
    buyNow: async () => {
      if (await addToCart()) router.push("/checkout");
    },
  };

  return <SelectionContext value={value}>{children}</SelectionContext>;
}

export function useProductSelection() {
  const ctx = use(SelectionContext);
  if (!ctx) throw new Error("useProductSelection must be used inside ProductSelectionProvider");
  return ctx;
}
