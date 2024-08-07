import type { Plan } from "@/types";

import { pricingConfig } from "@/config/pricing";

export function getPlanByPriceId({ priceId }: { priceId: string }) {
  return Object.values(pricingConfig.plans).find(
    (plan) => plan.stripePriceId === priceId,
  );
}

export function getPlanLimits({ planId }: { planId?: Plan["id"] }) {
  const { features } = pricingConfig.plans[planId ?? "gratuit"];

  const [productLimit] = features.map((feature) => {
    const [value] = feature.match(/\d+/) || [];
    return value ? parseInt(value, 10) : 0;
  });

  return { productLimit: productLimit ?? 0 };
}
