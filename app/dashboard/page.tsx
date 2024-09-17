"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import DashboardStats from "./_components/dashboard-stats";
import RecentSales from "./_components/recent-sales";
import Chart from "./_components/Chart";
import axios from "axios";

const DashboardPage = () => {
  const [chartData, setChartData] = useState<any>({});

  useEffect(()=> {
    const getData = async () => {
      try{
        const resp = await axios.get("/api/dashboard/chart");
        setChartData(resp.data);
      }catch(err){
        console.error("Error fetching data:", err)
      }
    }
    getData();
  },[])
  return (
    <>
      <DashboardStats />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-10">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              Recent transactions from the last 7 days
            </CardDescription>
            <CardContent>
              <Chart data={chartData} />
            </CardContent>
          </CardHeader>
        </Card>

        <RecentSales />
      </div>
    </>
  );
};

export default DashboardPage;
