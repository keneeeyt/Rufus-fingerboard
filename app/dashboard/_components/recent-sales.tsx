"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";

function RecentSales() {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.get("/api/dashboard/recent-sales");
        setData(resp.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getData();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>Recent sales from your store</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {isLoading ? (
          <p className="text-center mt-2">Loading...</p>
        ) : data.length > 0 ? (
          data.map((sale: any) => (
            <div className="flex items-center gap-4">
              <Avatar className="hidden sm:flex h-9 w-9">
                <AvatarImage src="" alt="user-profile" />
                <AvatarFallback>{sale.userDetails?.name.split(" ")[0].slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium">{sale.userDetails?.name}</p>
                <p className="text-sm text-muted-foreground">{sale.userDetails?.email}</p>
              </div>
              <p className="ml-auto font-medium">+${new Intl.NumberFormat("en-US").format(sale.amount / 100)}</p>
            </div>
          ))
        ) : (
          <p className="text-center mt-2">No recent sales</p>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentSales;
