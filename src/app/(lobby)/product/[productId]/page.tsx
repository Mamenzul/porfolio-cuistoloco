import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { products, stores } from "@/server/db/schema";
import { env } from "@/env.js";
import { and, desc, eq, not } from "drizzle-orm";

import { formatPrice, toTitleCase } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import { Shell } from "@/components/shell";

import { AddToCartForm } from "./_components/add-to-cart-form";
import { ProductCard } from "@/components/product-card";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const productId = decodeURIComponent(params.productId);

  const product = await db.query.products.findFirst({
    columns: {
      name: true,
      description: true,
    },
    where: eq(products.id, productId),
  });

  if (!product) {
    return {};
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(product.name),
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = decodeURIComponent(params.productId);

  const product = await db.query.products.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      price: true,
      images: true,
      inventory: true,
      rating: true,
      storeId: true,
    },

    where: eq(products.id, productId),
  });

  if (!product) {
    notFound();
  }

  const store = await db.query.stores.findFirst({
    columns: {
      id: true,
      name: true,
    },
    where: eq(stores.id, product.storeId),
  });

  const otherProducts = store
    ? await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          images: products.images,
          inventory: products.inventory,
          rating: products.rating,
        })
        .from(products)
        .limit(10)
        .where(
          and(
            eq(products.storeId, product.storeId),
            not(eq(products.id, productId)),
          ),
        )
        .orderBy(desc(products.inventory))
    : [];

  return (
    <Shell className="mx-auto max-w-5xl pb-12 md:pb-14">
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <ProductImageCarousel
          className="w-full md:w-1/2"
          images={[]}
          options={{
            loop: true,
          }}
        />
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold">{product.name}</h2>
            <p className="text-base text-muted-foreground">
              {formatPrice(product.price)}
            </p>
            {store ? (
              <Link
                href={`/${store.name.toLowerCase()}`}
                className="line-clamp-1 inline-block text-base text-muted-foreground hover:underline"
              >
                {store.name}
              </Link>
            ) : null}
          </div>
          <Separator className="my-1.5" />
          <p className="text-base text-muted-foreground">
            {product.inventory} en stock
          </p>
          <AddToCartForm productId={productId} showBuyNow={true} />
          <Separator className="mt-5" />
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="description"
          >
            <AccordionItem value="description" className="border-none">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {product.description ??
                  "Aucune description n'est disponible pour ce produit."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator className="md:hidden" />
        </div>
      </div>
      {store && otherProducts.length > 0 ? (
        <div className="max-w-5xl space-y-6">
          <h2 className="line-clamp-1 flex-1 text-2xl">
            <span>Plus de produits de </span>
            <span className="font-bold">{store.name}</span>
          </h2>
          <ScrollArea className="whitespace-nowrap">
            <div className="flex w-max gap-4">
              {otherProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="min-w-[260px] pb-4"
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ) : null}
    </Shell>
  );
}
