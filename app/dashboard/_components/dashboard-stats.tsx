"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  LoaderIcon,
  PartyPopper,
  ShoppingBag,
  Users2,
} from "lucide-react";
import axios from "axios";

type DataContent = {
  totalRevenue: string;
  orders: string;
  products: string;
  users: string;
};

function DashboardStats() {
  const [data, setData] = useState<DataContent>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const resp = await axios.get("/api/dashboard");
        setData(resp.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          {
            isLoading ? (
              <p className="text-center mt-2">
                <LoaderIcon className="h-5 w-5 text-muted-foreground animate-spin" />
              </p>
            ) : data ? (
              <>
                <p className="text-2xl font-bold">${new Intl.NumberFormat("en-US").format(Number(data?.totalRevenue) / 100)}</p>
                <p className="text-xs text-muted-foreground">Based on 100 Charges</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Based on 100 Charges</p>
              </>
            )
          }
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Sales</CardTitle>
          <ShoppingBag className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          {
            isLoading ? (
              <p className="text-center mt-2">
                <LoaderIcon className="h-5 w-5 text-muted-foreground animate-spin" />
              </p>
            ) : data ? (
              <>
                <p className="text-2xl font-bold">+{data?.orders}</p>
                <p className="text-xs text-muted-foreground">Total Sales on Rufus</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Total Sales on Rufus</p>
              </>
            )
          }
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Products</CardTitle>
          <PartyPopper className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          {
            isLoading ? (
              <p className="text-center mt-2">
                <LoaderIcon className="h-5 w-5 text-muted-foreground animate-spin" />
              </p>
            ) : data ? (
              <>
                <p className="text-2xl font-bold">{data?.products}</p>
                <p className="text-xs text-muted-foreground">
                  Total Products created
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">
                  Total Products created
                </p>
              </>
            )
          }
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Users</CardTitle>
          <Users2 className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center mt-2">
              <LoaderIcon className="h-5 w-5 text-muted-foreground animate-spin" />
            </p>
          ) : data ? (
            <>
              <p className="text-2xl font-bold">{data?.users}</p>
              <p className="text-xs text-muted-foreground">
                Total Users Signed Up
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">
                Total Users Signed Up
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardStats;
