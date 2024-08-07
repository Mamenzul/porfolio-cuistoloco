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
import { SignInForm } from "@/app/(auth)/_components/signin-form";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Se connecter",
  description: "Se connecter à votre compte",
};

export default function SignInPage() {
  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Se connecter</CardTitle>
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
          <SignInForm />
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            <span className="mr-1 hidden sm:inline-block">
              Vous n&apos;avez pas de compte ?
            </span>
            <Link
              aria-label="Sign up"
              href="/signup"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              S&apos;inscrire
            </Link>
          </div>
          <Link
            aria-label="Reset password"
            href="/signin/reset-password"
            className="text-sm text-primary underline-offset-4 transition-colors hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </CardFooter>
      </Card>
    </Shell>
  );
}
