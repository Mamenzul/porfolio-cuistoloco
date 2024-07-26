import type { Metadata } from "next";
import { env } from "@/env.js";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shell";
import { LogOutButtons } from "@/app/(auth)/_components/logout-buttons";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Déconnexion",
  description: "Déconnectez-vous de votre compte",
};

export default function SignOutPage() {
  return (
    <Shell className="max-w-md">
      <PageHeader className="text-center">
        <PageHeaderHeading size="sm">Déconnexion</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
        </PageHeaderDescription>
      </PageHeader>
      <LogOutButtons />
    </Shell>
  );
}
