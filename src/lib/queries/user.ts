import "server-only";

import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/server/db";
import { products, stores } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { count, countDistinct, eq } from "drizzle-orm";

import { getPlan } from "@/lib/actions/stripe";
import { getPlanLimits } from "@/lib/subscription";

/**
 * Cache is used with a data-fetching function like fetch to share a data snapshot between components.
 * It ensures a single request is made for multiple identical data fetches, with the returned data cached and shared across components during the server render.
 * @see https://react.dev/reference/react/cache#reference
 */
export const getCachedUser = cache(currentUser);

export async function getUserUsageMetrics(input: { userId: string }) {
  noStore();
  try {
    const data = await db
      .select({
        productCount: count(products.id),
      })
      .from(stores)
      .leftJoin(products, eq(stores.id, products.storeId))
      .where(eq(stores.userId, input.userId))
      .groupBy(stores.userId)
      .execute()
      .then((res) => res[0]);

    return {
      productCount: data?.productCount ?? 0,
    };
  } catch (err) {
    return {
      productCount: 0,
    };
  }
}

export async function getUserPlanMetrics(input: { userId: string }) {
  noStore();

  const fallback = {
    productCount: 0,
    productLimit: 0,
    storeLimitExceeded: false,
    productLimitExceeded: false,
    subscriptionPlan: null,
  };

  try {
    const subscriptionPlan = await getPlan({ userId: input.userId });

    if (!subscriptionPlan) {
      return fallback;
    }

    const { productCount } = await getUserUsageMetrics({
      userId: input.userId,
    });

    const { productLimit } = getPlanLimits({
      planId: subscriptionPlan.id,
    });

    const productLimitExceeded = productCount >= productLimit;

    return {
      productCount,
      productLimit,
      productLimitExceeded,
      subscriptionPlan,
    };
  } catch (err) {
    return fallback;
  }
}
