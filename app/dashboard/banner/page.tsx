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

const BannerPage = () => {
  const [banners, setBanner] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [id, setId] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const resp = await axios.get("/api/banner");
        setBanner(resp.data);
      } catch (err) {
        setBanner([]);
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  const deleteBanner = async (id: string) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/banner/${id}`);
      setBanner(banners.filter((banner: any) => banner._id !== id));
      toast.success("Banner deleted successfully");
      setDeleteLoading(false);
      setIsDelete(false);
    } catch (err) {
      setDeleteLoading(false);
      console.log(err);
      toast.error("Something went wrong")
    }
  };

  const hanldeOpenModal = async (id: string) => {
    console.log(id);
    setId(id);

    if (id) {
      setIsDelete(true);
    }
  };

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
      accessorKey: "banner_image",
      cell: ({ row }: { row: any }) => (
        <Image
          src={row.original.banner_image}
          alt="product image"
          height={64}
          width={64}
          className="rounded-md object-cover h-16 w-16"
        />
      ),
    },
    {
      accessorKey: "banner_name",
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
              <Link href={`/dashboard/banner/${row.original._id}`}>
                Edit
              </Link>
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
          <CardTitle>Banners</CardTitle>
          <CardDescription>Manage your banners</CardDescription>
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
              data={banners}
              link={"/dashboard/banner/create"}
              AddName="Add Banner"
              searchBy={"banner_name"}
            />
          )}
        </CardContent>
      </Card>
      <Modal
        open={isDelete}
        onClose={() => setIsDelete(false)}
        color="red"
        onConfirm={() => deleteBanner(id)}
        title={"Are you sure you want to delete this banner?"}
        description={
          "Please confirm that you wish to delete this banner. This action cannot be undone."
        }
        loading={deleteLoading}
      />
    </>
  );
};

export default BannerPage;
