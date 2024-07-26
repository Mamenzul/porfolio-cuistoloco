import type { FooterItem, MainNavItem } from "@/types";

export type SiteConfig = typeof siteConfig;

const links = {
  github: "https://github.com/Mamenzul",
  githubAccount: "https://github.com/Mamenzul",
};

export const siteConfig = {
  name: "CuistoLoco",
  description:
    "CuistoLoco est une application de gestion backoffice pour les traiteurs",
  url: "https://cuistoloco.bretteswebservices.fr",
  ogImage: "https://cuistoloco.bretteswebservices.fr/opengraph-image.png",
  links,
  mainNav: [] satisfies MainNavItem[],
  footerNav: [
    {
      title: "Aide",
      items: [
        {
          title: "A propos",
          href: "/about",
          external: false,
        },
        {
          title: "Contact",
          href: "/contact",
          external: false,
        },
        {
          title: "Termes",
          href: "/terms",
          external: false,
        },
        {
          title: "Confidentialité",
          href: "/privacy",
          external: false,
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "GitHub",
          href: links.githubAccount,
          external: true,
        },
      ],
    },
  ] satisfies FooterItem[],
};
