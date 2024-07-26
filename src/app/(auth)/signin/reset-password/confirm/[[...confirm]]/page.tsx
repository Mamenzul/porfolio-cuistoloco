import { type Metadata } from "next";
import { env } from "@/env.js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shell } from "@/components/shell";
import { ResetPasswordConfirmForm } from "@/app/(auth)/_components/reset-password-confirm-form";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Réinitialiser votre mot de passe",
  description:
    "Entrez votre adresse e-mail pour réinitialiser votre mot de passe",
};
export default function ResetPasswordConfirmPage() {
  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            Réinitialiser votre mot de passe
          </CardTitle>
          <CardDescription>
            Entrez votre adresse e-mail pour réinitialiser votre mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordConfirmForm />
        </CardContent>
      </Card>
    </Shell>
  );
}
