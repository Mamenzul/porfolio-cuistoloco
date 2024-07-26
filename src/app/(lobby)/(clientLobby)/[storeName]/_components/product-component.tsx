"use client";

import * as React from "react";

import { type PopoverTrigger } from "@/components/ui/popover";
import { type getProductsFromStore } from "@/lib/queries/product";
import { ProductCard } from "@/components/product-card";
import { ContentSection } from "@/components/content-section";
interface ProductCardProps
  extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  productsPromise: ReturnType<typeof getProductsFromStore>;
}

export function ProductComponent({ productsPromise }: ProductCardProps) {
  const products = React.use(productsPromise);
  return (
    <ContentSection
      title="Produits"
      description="Explorez notre sélection de produits"
      className="pt-14 md:pt-20 lg:pt-24"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ContentSection>
  );
}
