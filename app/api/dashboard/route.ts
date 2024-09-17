import { connectDB } from "@/config/mongo-connect";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    // Fetch all data in parallel for better performance
    const [users, products, orders] = await Promise.all([
      User.find({}).lean(),
      Product.find({}).lean(),
      Order.find({}).lean(),
    ]);

    // Calculate total revenue
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

    return NextResponse.json(
      {
        users: users.length,
        products: products.length,
        orders: orders.length,
        totalRevenue,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching data:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
