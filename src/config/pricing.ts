import { env } from "@/env.js";
import { type Plan } from "@/types";

export type PricingConfig = typeof pricingConfig;

export const pricingConfig = {
  plans: {
    gratuit: {
      id: "gratuit",
      title: "Gratuit",
      description: "Parfait pour tester la plateforme.",
      features: ["Créer jusqu'à 5 produits"],
      stripePriceId: "",
      limits: {
        products: 5,
      },
    },
    standart: {
      id: "standart",
      title: "Standart",
      description: "Parfait pour les traiteurs qui veulent vendre en ligne.",
      features: ["Créer jusqu'à 25 produits"],
      stripePriceId: env.STRIPE_STD_MONTHLY_PRICE_ID,
      limits: {
        products: 25,
      },
    },
  } satisfies Record<Plan["id"], Plan>,
};
