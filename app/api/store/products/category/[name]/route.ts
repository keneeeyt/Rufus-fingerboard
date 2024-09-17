import { connectDB } from "@/config/mongo-connect";
import Product from "@/lib/models/Product";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, {params}: {params: {name: string}}) => {
  try{
  
    await connectDB();

    if(params.name === "all") {
      const products = await Product.find({}).lean();
      return NextResponse.json(products, {status: 200});
    }

    const products = await Product.find({product_category: params.name}).lean();

    return NextResponse.json(products, {status: 200});

  }catch(err){
    console.log(err)
    return new NextResponse("Internal Server Error", {status: 500})
  }
}