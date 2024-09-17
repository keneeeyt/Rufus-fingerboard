import { connectDB } from "@/config/mongo-connect";
import Cart from "@/lib/models/Cart";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    let cart = (await Cart.findOne({ userId: user.id })) || null;

    if (!cart || !cart.items) {
      return new NextResponse("Cart is empty", { status: 200 });
    }
   

   return NextResponse.json(cart.items, { status: 200 });

   
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
