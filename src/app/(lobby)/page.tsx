import { Shell } from "@/components/shell";
import { getCachedUser } from "@/lib/queries/user";
import * as React from "react";
import { ActionLink } from "./_components/action-link";
import { getFeaturedStores } from "@/lib/queries/store";
import { Skeleton } from "@/components/ui/skeleton";
import { StoreComponent } from "./_components/store-component";

export default async function IndexPage() {
  const user = await getCachedUser();
  const storesPromise = getFeaturedStores();

  return (
    <>
      <Shell>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Une plateforme de gestion de cuisine pour les traiteurs
              </h1>
              <p className="mx-auto max-w-3xl max-w-[600px] text-muted-foreground md:text-xl">
                Gérez les commandes en ligne, l&apos;inventaire et les rapports
                de vente de votre cuisine, le tout sur une seule plateforme.
              </p>
              <div className="flex w-full flex-col justify-center gap-2 min-[400px]:flex-row">
                <ActionLink user={user} />
              </div>
            </div>
          </div>
        </section>
      </Shell>

      <section className="w-full bg-muted py-12 dark:bg-background md:py-24 lg:py-32">
        <Shell>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Fonctionnalités
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Simplifiez la gestion de votre cuisine
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Notre plateforme propose une suite complète d&apos;outils pour
                  vous aider à gérer les commandes en ligne, l&apos;inventaire
                  et les rapports de vente de votre restaurant.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                  <h3 className="text-xl font-bold">Commande en ligne</h3>
                </div>
                <p className="text-muted-foreground">
                  Permettez aux clients de passer des commandes directement
                  depuis la plateforme.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  </svg>
                  <h3 className="text-xl font-bold">Gestion des stocks</h3>
                </div>
                <p className="text-muted-foreground">
                  Suivez l&apos;inventaire de votre cuisine en temps réel pour
                  éviter les ruptures de stock.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <line x1="12" x2="12" y1="20" y2="10"></line>
                    <line x1="18" x2="18" y1="20" y2="4"></line>
                    <line x1="6" x2="6" y1="20" y2="16"></line>
                  </svg>
                  <h3 className="text-xl font-bold">Reporting des ventes</h3>
                </div>
                <p className="text-muted-foreground">
                  Générez des rapports de vente détaillés pour vous aider à
                  prendre des décisions commerciales éclairées.
                </p>
              </div>
            </div>
          </div>
        </Shell>
      </section>
      <Shell>
        <section className="mx-auto w-full max-w-5xl py-12 md:py-24 lg:py-32">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Pourquoi nous choisir
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Un partenaire de confiance pour les traiteurs
              </h2>

              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Notre plateforme est conçue pour aider les restaurants de toutes
                tailles à rationaliser leurs opérations et à développer leur
                activité.
              </p>
            </div>
          </div>
        </section>
      </Shell>
      <Shell>
        <React.Suspense fallback={<Skeleton className="size-full" />}>
          <StoreComponent storesPromise={storesPromise} />
        </React.Suspense>
      </Shell>
    </>
  );
}
