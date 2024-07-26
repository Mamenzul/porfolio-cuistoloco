import "server-only";

import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from "next/cache";
import { db } from "@/server/db";
import { products, stores, type Product } from "@/server/db/schema";
import type { SearchParams } from "@/types";
import { and, asc, count, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";

import { getProductsSchema } from "@/lib/validations/product";

// See the unstable_cache API docs: https://nextjs.org/docs/app/api-reference/functions/unstable_cache
export async function getFeaturedProducts() {
  return await cache(
    async () => {
      return db
        .select({
          id: products.id,
          name: products.name,
          images: products.images,
          price: products.price,
          inventory: products.inventory,
          stripeAccountId: stores.stripeAccountId,
        })
        .from(products)
        .limit(8)
        .leftJoin(stores, eq(products.storeId, stores.id))
        .groupBy(products.id, stores.stripeAccountId)
        .orderBy(
          desc(count(stores.stripeAccountId)),
          desc(count(products.images)),
          desc(products.createdAt),
        );
    },
    ["featured-products"],
    {
      revalidate: 3600, // every hour
      tags: ["featured-products"],
    },
  )();
}
export async function getProductsFromStore(storeId: string) {
  noStore();
  try {
    const transaction = await db
      .select({
        id: products.id,
        name: products.name,
        images: products.images,
        price: products.price,
        inventory: products.inventory,
        stripeAccountId: stores.stripeAccountId,
        description: products.description,
      })
      .from(products)
      .where(eq(products.storeId, storeId))
      .leftJoin(stores, eq(products.storeId, stores.id))
      .orderBy(desc(products.createdAt));
    return transaction;
  } catch (err) {
    return [];
  }
}
// See the unstable_noStore API docs: https://nextjs.org/docs/app/api-reference/functions/unstable_noStore
export async function getProducts(input: SearchParams) {
  noStore();

  try {
    const search = getProductsSchema.parse(input);

    const limit = search.per_page;
    const offset = (search.page - 1) * limit;

    const [column, order] = (search.sort?.split(".") as [
      keyof Product | undefined,
      "asc" | "desc" | undefined,
    ]) ?? ["createdAt", "desc"];
    const [minPrice, maxPrice] = search.price_range?.split("-") ?? [];
    const storeIds = search.store_ids?.split(".") ?? [];

    const transaction = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          images: products.images,
          price: products.price,
          inventory: products.inventory,
          rating: products.rating,
          storeId: products.storeId,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          stripeAccountId: stores.stripeAccountId,
        })
        .from(products)
        .limit(limit)
        .offset(offset)
        .leftJoin(stores, eq(products.storeId, stores.id))
        .where(
          and(
            minPrice ? gte(products.price, minPrice) : undefined,
            maxPrice ? lte(products.price, maxPrice) : undefined,
            storeIds.length ? inArray(products.storeId, storeIds) : undefined,
            input.active === "true"
              ? sql`(${stores.stripeAccountId}) is not null`
              : undefined,
          ),
        )
        .groupBy(products.id)
        .orderBy(
          column && column in products
            ? order === "asc"
              ? asc(products[column])
              : desc(products[column])
            : desc(products.createdAt),
        );

      const total = await tx
        .select({
          count: count(products.id),
        })
        .from(products)
        .where(
          and(
            minPrice ? gte(products.price, minPrice) : undefined,
            maxPrice ? lte(products.price, maxPrice) : undefined,
            storeIds.length ? inArray(products.storeId, storeIds) : undefined,
          ),
        )
        .execute()
        .then((res) => res[0]?.count ?? 0);

      const pageCount = Math.ceil(total / limit);

      return {
        data,
        pageCount,
      };
    });

    return transaction;
  } catch (err) {
    return {
      data: [],
      pageCount: 0,
    };
  }
}
