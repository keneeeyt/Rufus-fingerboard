import { connectDB } from "@/config/mongo-connect";
import Order from "@/lib/models/Order";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, {params}: {params: {id: string}}) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== process.env.VALID_EMAIL_ADMIN) {
      return NextResponse.redirect("/", 302);
    }

    await connectDB();

    const formData = await req.json();

    await Order.findByIdAndUpdate(params.id, formData);

    return NextResponse.json("Success", {status: 200})

  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


export const GET = async ({},{params}:{params:{id: string}}) => {
  try{
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== process.env.VALID_EMAIL_ADMIN) {
      return NextResponse.redirect("/", 302);
    }

    await connectDB();

    const order = await Order.findById(params.id);

    return NextResponse.json(order, {status: 200});
  }catch(err){
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
