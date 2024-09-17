"use client";
import { DataTable } from "@/components/custom/data-table";
import Modal from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown, LoaderIcon, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [id, setId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);


  useEffect(()=> {
    const getCategories = async () => {
      try{
        setIsLoading(true);
        const resp = await axios.get("/api/category");
        setCategories(resp.data);
      }catch(err){
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getCategories();
  },[isSubmitted, setIsSubmitted])

  const deleteCategory = async (id: string) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/category/${id}`);
      setCategories(categories.filter((category: any) => category._id !== id));
      toast.success("Category deleted successfully");
      setDeleteLoading(false);
      setIsDelete(false);
    } catch (err) {
      setDeleteLoading(false);
      console.log(err);
      toast.error("Something went wrong")
    }
  };

  const hanldeOpenModal = async (id: string) => {
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
      accessorKey: "category_title",
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
              <Link href={`/dashboard/categories/${row.original._id}`}>Edit</Link>
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
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage your product categories efficiently. This section allows you
            to organize, edit, and update the categories for better product
            classification and ease of access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 mt-32 mb-32">
              <LoaderIcon className="h-5 w-5 animate-spin" />{" "}
              <span className="text-muted-foreground">Loading data</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={categories}
              link={"/dashboard/categories/create"}
              AddName="Add Category"
              searchBy={"category_title"}
            />
          )}
        </CardContent>
      </Card>
      <Modal
        open={isDelete}
        onClose={() => setIsDelete(false)}
        color="red"
        onConfirm={() => deleteCategory(id)}
        title={"Are you sure you want to delete this category?"}
        description={
          "Please confirm that you wish to delete this category. This action cannot be undone."
        }
        loading={deleteLoading}
      />
    </>
  );
}

export default CategoriesPage;
