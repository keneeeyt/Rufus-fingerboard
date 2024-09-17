"use client"
import ErrorPage from "@/app/error-page";
import { DataTable } from "@/components/custom/data-table";
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
import Link from "next/link";
import React, { useEffect, useState } from "react";
import UpdateOrder from "../_components/update-order";

const OrdersPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [order, setOrders] = useState<any>([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [id, setId] = useState<string>("");


  useEffect(()=> {
    const getOrders = async () => {
      try{
        setIsLoading(true)
        const res = await axios.get("/api/orders")
        setOrders(res.data)
      }catch(err){
        console.error(err)
        setIsError(true)
      } finally{
        setIsLoading(false)
      }
    }
    getOrders();
  },[isUpdate, setIsUpdate])
  
  const handleUpdate = (id: string) => {
    setId(id);
    console.log(id)
    if(id){
      setIsUpdate(true)
    }
    
  }

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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorKey: "userDetails",
      cell: ({ row }: { row: any }) => (
        <div>
          <p className="text-sm font-semibold">
            {row.original.userDetails.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.original.userDetails.email}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Delivery Status",
      accessorKey: "delivery_status",
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
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }: { row: any }) =>
      `$${new Intl.NumberFormat("en-US").format(row.original.amount / 100)}`,
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
            <DropdownMenuItem onClick={()=> handleUpdate(row.original._id)}>
              Update
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];



  if(isError){
    return <ErrorPage />
  }

  return (
    <>
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Orders</CardTitle>
        <CardDescription>Recent orders from your store</CardDescription>
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
            data={order}
            link={"/dashboard/products/create"}
            searchBy={"status"}
          />
        )}
      </CardContent>
    </Card>
    <UpdateOrder 
      open={isUpdate} 
      onClose={() => setIsUpdate(false)} 
      id={id}
    />
    </>
  );
};

export default OrdersPage;
