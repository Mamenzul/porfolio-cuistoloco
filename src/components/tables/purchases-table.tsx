"use client";

import * as React from "react";
import Link from "next/link";
import { type Order } from "@/server/db/schema";
import type { StripePaymentStatus } from "@/types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

import {
  getStripePaymentStatusColor,
  stripePaymentStatuses,
} from "@/lib/checkout";
import { cn, formatDate, formatId, formatPrice } from "@/lib/utils";
import { checkoutItemSchema } from "@/lib/validations/cart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTable } from "@/hooks/use-data-table";

export type AwaitedOrder = Pick<
  Order,
  "id" | "email" | "items" | "amount" | "createdAt" | "storeId"
> & {
  status: Order["stripePaymentIntentStatus"];
  store: string | null;
};

interface PurchasesTableProps {
  promise: Promise<{
    data: AwaitedOrder[];
    pageCount: number;
  }>;
}

export function PurchasesTable({ promise }: PurchasesTableProps) {
  const { data, pageCount } = React.use(promise);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<AwaitedOrder, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Commande" />
        ),
        cell: ({ cell }) => {
          return <span>{formatId(String(cell.getValue()))}</span>;
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Statut du paiement" />
        ),
        cell: ({ cell }) => {
          return (
            <Badge
              variant="outline"
              className={cn(
                "pointer-events-none text-sm capitalize text-white",
                getStripePaymentStatusColor({
                  status: cell.getValue() as StripePaymentStatus,
                  shade: 600,
                }),
              )}
            >
              {String(cell.getValue())}
            </Badge>
          );
        },
      },
      {
        accessorKey: "store",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Boutique" />
        ),
      },
      {
        accessorKey: "items",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Qté" />
        ),
        cell: ({ cell }) => {
          const safeParsedItems = z
            .array(checkoutItemSchema)
            .safeParse(JSON.parse(cell.getValue() as string));

          return (
            <span>
              {safeParsedItems.success
                ? safeParsedItems.data.reduce(
                    (acc, item) => acc + item.quantity,
                    0,
                  )
                : 0}
            </span>
          );
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Montant" />
        ),
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },

      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Créé le" />
        ),
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/purchases/${row.original.id}`}>
                  Détails des achats
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/products?store_ids=${row.original.storeId}`}>
                  Voir la boutique
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );
  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  });

  return <DataTable table={table} />;
}
