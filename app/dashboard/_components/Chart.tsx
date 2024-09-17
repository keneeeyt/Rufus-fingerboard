"use client";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

interface ChartProps {
  data: any;
}

const aggregateData = (data: any) => {
  if (!Array.isArray(data)) {
    console.error("Expected an array but got:", data);
    return [];
  }

  const aggregatedData = data.reduce((acc: any, curr: any) => {
    const date = new Date(curr.date).toLocaleDateString(); // Ensure the date format is consistent

    if (acc[date]) {
      acc[date] += curr.revenue;
    } else {
      acc[date] = curr.revenue;
    }

    return acc; // Make sure to return the accumulator
  }, {});

  return Object.keys(aggregatedData).map((date) => ({
    date,
    revenue: aggregatedData[date],
  }));
};

const Chart = ({ data }: ChartProps) => {
  const processedData = aggregateData(data);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={processedData}>
        <CartesianGrid strokeDasharray={"3 3"} />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          stroke="#3b82f6"
          activeDot={{ r: 8 }}
          dataKey="revenue"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
