"use client";

import * as React from "react";
import Link from "next/link";
import { type Product } from "@/server/db/schema";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { deleteProduct } from "@/lib/actions/product";
import { getErrorMessage } from "@/lib/handle-error";
import { formatDate, formatPrice } from "@/lib/utils";
import { useDataTable } from "@/hooks/use-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

type AwaitedProduct = Pick<
  Product,
  "id" | "name" | "price" | "inventory" | "createdAt"
>;

interface ProductsTableProps {
  promise: Promise<{
    data: AwaitedProduct[];
    pageCount: number;
  }>;
  storeId: string;
}

export function ProductsTable({ promise, storeId }: ProductsTableProps) {
  const { data, pageCount } = React.use(promise);

  const [isPending, startTransition] = React.useTransition();
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<AwaitedProduct, unknown>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              setSelectedRowIds((prev) =>
                prev.length === data.length ? [] : data.map((row) => row.id),
              );
            }}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              setSelectedRowIds((prev) =>
                value
                  ? [...prev, row.original.id]
                  : prev.filter((id) => id !== row.original.id),
              );
            }}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Nom" />
        ),
      },

      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Prix" />
        ),
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },
      {
        accessorKey: "inventory",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Inventaire" />
        ),
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
                <Link href={`/store/${storeId}/products/${row.original.id}`}>
                  Modifier
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/product/${row.original.id}`}>Voir</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  startTransition(() => {
                    row.toggleSelected(false);

                    toast.promise(
                      deleteProduct({
                        id: row.original.id,
                        storeId,
                      }),
                      {
                        loading: "Deleting...",
                        success: () => "Product deleted successfully.",
                        error: (err: unknown) => getErrorMessage(err),
                      },
                    );
                  });
                }}
                disabled={isPending}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [data, isPending, storeId],
  );

  function deleteSelectedRows() {
    toast.promise(
      Promise.all(
        selectedRowIds.map((id) =>
          deleteProduct({
            id,
            storeId,
          }),
        ),
      ),
      {
        loading: "Suppression en cours...",
        success: () => {
          setSelectedRowIds([]);
          return "Le produit a été supprimé avec succès.";
        },
        error: (err: unknown) => {
          setSelectedRowIds([]);
          return getErrorMessage(err);
        },
      },
    );
  }

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields: [
      {
        value: "name",
        label: "Nom",
      },
    ],
  });

  return <DataTable table={table} />;
}
