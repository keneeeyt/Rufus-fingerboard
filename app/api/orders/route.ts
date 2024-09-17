import { connectDB } from "@/config/mongo-connect";
import Order from "@/lib/models/Order";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { NextResponse } from "next/server"

export const GET = async () => {
  try{
    const {getUser} =  getKindeServerSession();
    const user = await getUser();

    if(!user || user.email !== process.env.VALID_EMAIL_ADMIN){
      return new NextResponse("Unauthorized", {status: 401})
    }

    await connectDB();

    const orders = await Order.find({}).sort({createdAt: -1})

    return NextResponse.json(orders, {status: 200})
  }catch(err){
    console.log(err)
    return new NextResponse("Internal Server Error", {status: 500})
  }
}