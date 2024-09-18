import { connectDB } from "@/config/mongo-connect";
import Category from "@/lib/models/Category";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req:NextRequest, {params} : {params: {id: any}}) => {

  const {getUser} = getKindeServerSession();
  const user = await getUser();

  if(!user || (user.email !== `${process.env.VALID_EMAIL_ADMIN}` && user.email !== 'rufusfingerboards@gmail.com')) {
    return NextResponse.redirect("https://rufus-fingerboard.vercel.app/")
  }

  await connectDB();

  const {id} = params;

  const category = await Category.findById(id);

  if(!category) {
    return new NextResponse(
      JSON.stringify({error: "Category not found"}),
      {status: 404}
    );
  }

  return NextResponse.json(category, { status: 200 });

}

export const PUT = async (req: NextRequest, {params} : {params: {id: any}}) => {
  const {getUser} = getKindeServerSession();
  const user = await getUser();

  if(!user || (user.email !== `${process.env.VALID_EMAIL_ADMIN}` && user.email !== 'rufusfingerboards@gmail.com')) {
    return NextResponse.redirect("https://rufus-fingerboard.vercel.app/")
  }

  await connectDB();

  const {id} = params;
  const formData = await req.json();

  const updatedDate = {
    category_name: formData.category_name?.toLowerCase() ?? "",
    category_title: formData.category_name,
    category_image: formData.category_image
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, updatedDate , {
    new: true,
  });

  if(!updatedCategory) {
    return new NextResponse(
      JSON.stringify({error: "Category not found"}),
      {status: 404}
    );
  }

  return NextResponse.json(updatedCategory, { status: 200 });
}

export const DELETE = async (req: NextRequest, {params} : {params: {id: any}}) => {
  const {getUser} = getKindeServerSession();
  const user = await getUser();

  if(!user || (user.email !== `${process.env.VALID_EMAIL_ADMIN}` && user.email !== 'rufusfingerboards@gmail.com')) {
    return NextResponse.redirect("https://rufus-fingerboard.vercel.app/")
  }

  await connectDB();

  const {id} = params;

  const category = await Category.findByIdAndDelete(id);

  if(!category) {
    return new NextResponse(
      JSON.stringify({error: "Category not found"}),
      {status: 404}
    );
  }


  return new NextResponse(
    JSON.stringify({message: "Category deleted successfully"}),
    {status: 200}
  );
}