import { connectDB } from "@/config/mongo-connect";
import Order from "@/lib/models/Order";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await connectDB();

    const orders = await Order.find({
      createdAt: { $gte: sevenDaysAgo },
    })
      .select("amount createdAt")
      .sort({ createdAt: 1 })
      .lean();

     const result = orders.map((item)=> ({
      date: new Intl.DateTimeFormat("en-US").format(item.createdAt),
      revenue: item.amount / 100
     }))  

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error fetching data:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
