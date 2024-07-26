import type { Metadata } from "next";
import { env } from "@/env.js";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shell";

import { UserProfile } from "./_components/user-profile";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Compte",
  description: "Gérez vos paramètres de compte",
};

export default function AccountPage() {
  return (
    <Shell variant="sidebar" className="overflow-hidden">
      <PageHeader>
        <PageHeaderHeading size="sm">Account</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Gérez vos paramètres de compte{" "}
        </PageHeaderDescription>
      </PageHeader>
      <ScrollArea className="w-full pb-3.5">
        <UserProfile />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Shell>
  );
}
