import { connectDB } from "@/config/mongo-connect";
import Product from "@/lib/models/Product";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
 try{


  await connectDB();

  const products = await Product.find({featured: true}).limit(3);

  return NextResponse.json(products, {status: 200});
 }catch(err){
  console.log(err);
  return new NextResponse("Internal Server Error", {status: 500})
 }
}