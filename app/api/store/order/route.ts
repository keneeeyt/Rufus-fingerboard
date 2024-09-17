import { connectDB } from "@/config/mongo-connect";
import Order from "@/lib/models/Order";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest) => {
  try{
    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if(!user) {
      return NextResponse.json("Unauthorized", {status: 401})
    }

    await connectDB();

    const myOrder = await Order.find({userId: user.id}).sort({createdAt: -1});

    return NextResponse.json(myOrder, {status: 200});
    
  }catch(err){
    console.log(err)
    return new NextResponse("Internal Server Error", {status: 500})
  }
}