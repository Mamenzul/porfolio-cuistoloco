import { type Metadata } from "next";
import Link from "next/link";
import { env } from "@/env.js";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shell } from "@/components/shell";
import { OAuthSignIn } from "@/app/(auth)/_components/oauth-signin";
import { SignUpForm } from "@/app/(auth)/_components/signup-form";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "S'incrire",
  description: "Créez un compte pour accéder à toutes les fonctionnalités",
};

export default function SignUpPage() {
  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">S&apos;inscrire</CardTitle>
          <CardDescription>
            Choisissez votre méthode de connexion préférée
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <OAuthSignIn />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continuer avec
              </span>
            </div>
          </div>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link
              aria-label="Sign in"
              href="/signin"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Shell>
  );
}
