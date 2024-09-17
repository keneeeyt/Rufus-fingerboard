import { connectDB } from "@/config/mongo-connect";
import Order from "@/lib/models/Order";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  try{
    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if(!user){
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    // recent sales
    const recentSales = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(7)
    .select('amount userId userDetails.name userDetails.email')
    .lean();

    return NextResponse.json(recentSales, { status: 200 });


  } catch (err){
    console.error("Error fetching data:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}