import * as React from "react";
import Link from "next/link";
import type { User } from "@clerk/nextjs/server";
import { DashboardIcon, ExitIcon } from "@radix-ui/react-icons";

import { getStoreByUserIdSlug } from "@/lib/queries/store";
import { cn, getUserEmail } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthDropdownProps
  extends React.ComponentPropsWithRef<typeof DropdownMenuTrigger>,
    ButtonProps {
  user: User | null;
}

export async function AuthDropdown({
  user,
  className,
  ...props
}: AuthDropdownProps) {
  if (!user) {
    return (
      <Button size="sm" className={cn(className)} {...props} asChild>
        <Link href="/signin">
          Se connecter
          <span className="sr-only"> Se connecter</span>
        </Link>
      </Button>
    );
  }

  const initials = `${user.firstName?.charAt(0) ?? ""} ${
    user.lastName?.charAt(0) ?? ""
  }`;
  const email = getUserEmail(user);

  const storePromise = getStoreByUserIdSlug({ userId: user.id });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn("size-8 rounded-full", className)}
          {...props}
        >
          <Avatar className="size-8">
            <AvatarImage src={user.imageUrl} alt={user.username ?? ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <React.Suspense
          fallback={
            <div className="flex flex-col space-y-1.5 p-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-sm" />
              ))}
            </div>
          }
        >
          <AuthDropdownGroup storePromise={storePromise} />
        </React.Suspense>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/signout">
            <ExitIcon className="mr-2 size-4" aria-hidden="true" />
            Déconnexion
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AuthDropdownGroupProps {
  storePromise: ReturnType<typeof getStoreByUserIdSlug>;
}

async function AuthDropdownGroup({ storePromise }: AuthDropdownGroupProps) {
  const store = await storePromise;

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem asChild>
        <Link href={store ? `/store/${store.id}` : "/onboarding"}>
          <DashboardIcon className="mr-2 size-4" aria-hidden="true" />
          Tableau de bord
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
