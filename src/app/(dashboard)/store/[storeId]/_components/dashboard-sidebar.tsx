"use client";

import * as React from "react";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { type SidebarNavItem } from "@/types";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "@/components/layouts/sidebar-nav";

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLElement> {
  storeId: string;
  children: React.ReactNode;
}

export function DashboardSidebar({
  storeId,
  children,
  className,
  ...props
}: DashboardSidebarProps) {
  const segments = useSelectedLayoutSegments();

  const sidebarNav: SidebarNavItem[] = [
    {
      title: "Tableau de bord",
      href: `/store/${storeId}`,
      icon: "dashboard",
      active: segments.length === 0,
    },
    {
      title: "Commandes",
      href: `/store/${storeId}/orders`,
      icon: "cart",
      active: segments.includes("orders"),
    },
    {
      title: "Produits",
      href: `/store/${storeId}/products`,
      icon: "product",
      active: segments.includes("products"),
    },
    {
      title: "Clients",
      href: `/store/${storeId}/customers`,
      icon: "avatar",
      active: segments.includes("customers"),
    },
    {
      title: "Analyses",
      href: `/store/${storeId}/analytics`,
      icon: "analytics",
      active: segments.includes("analytics"),
    },
    {
      title: "Paramètres",
      href: `/store/${storeId}/settings`,
      icon: "settings",
      active: segments.includes("settings"),
    },
    {
      title: "Facturation",
      href: `/store/${storeId}/billing`,
      icon: "dollarSign",
      active: segments.includes("billing"),
    },
    {
      title: "Compte",
      href: `/store/${storeId}/account`,
      icon: "users",
      active: segments.includes("account"),
    },
  ];

  return (
    <aside className={cn("h-screen w-full", className)} {...props}>
      <div className="hidden h-[3.55rem] items-center border-b border-border/60 px-4 lg:flex lg:px-6">
        <Link
          href="/"
          className="font-heading flex w-fit items-center tracking-wider text-foreground/90 transition-colors hover:text-foreground"
        >
          {siteConfig.name}
        </Link>
      </div>
      <div className="flex flex-col gap-2.5 px-4 pt-2 lg:px-6 lg:pt-4">
        {children}
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)] px-3 py-2.5 lg:px-5">
        <SidebarNav items={sidebarNav} className="p-1 pt-4" />
      </ScrollArea>
    </aside>
  );
}
