"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/custom/data-table";

import axios from "axios";
import {
  MoreHorizontal,
  PlusCircle,
  ArrowUpDown,
  LoaderIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Modal from "@/components/custom/modal";
import { toast } from "sonner";

const productsPage = () => {
  const [products, setProduct] = useState([]);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [id, setId] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const resp = await axios.get("/api/product");
        setProduct(resp.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
        setProduct([]);
      }
    };

    getProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/product/${id}`);
      setProduct(products.filter((product: any) => product._id !== id));
      toast.success("Product deleted successfully");
      setDeleteLoading(false);
      setIsDelete(false);
    } catch (err) {
      setDeleteLoading(false);
      console.log(err);
    }
  };

  const hanldeOpenModal = async (id: string) => {
    console.log(id);
    setId(id);

    if (id) {
      setIsDelete(true);
    }
  };

  // Define the columns for the DataTable
  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Image",
      accessorKey: "product_images",
      cell: ({ row }: { row: any }) => (
        <Image
          src={row.original.product_images[0]}
          alt="product image"
          height={64}
          width={64}
          className="rounded-md object-cover h-16 w-16"
        />
      ),
    },
    {
      accessorKey: "product_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "product_status",
    },
    {
      header: "Price",
      accessorKey: "product_price",
      cell: ({ row }: { row: any }) =>
        `$${row.original.product_price.toLocaleString()}`,
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ row }: { row: any }) =>
        new Intl.DateTimeFormat("en-US").format(
          new Date(row.original.createdAt)
        ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: { row: any }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"ghost"} className="outline-none">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/products/${row.original._id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => hanldeOpenModal(row.original._id)}>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Manage your products and view their sales performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 mt-32 mb-32">
              <LoaderIcon className="h-5 w-5 animate-spin" /> <span className="text-muted-foreground">Loading data</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={products}
              link={"/dashboard/products/create"}
              AddName="Add Product"
              searchBy={"product_name"}
            />
          )}
        </CardContent>
      </Card>
      <Modal
        open={isDelete}
        onClose={() => setIsDelete(false)}
        color="red"
        onConfirm={() => deleteProduct(id)}
        title={"Are you sure you want to delete this product?"}
        description={
          "Please confirm that you wish to delete this product. This action cannot be undone."
        }
        loading={deleteLoading}
      />
    </>
  );
};

export default productsPage;
