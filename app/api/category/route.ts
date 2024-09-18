import { connectDB } from "@/config/mongo-connect";
import Category from "@/lib/models/Category";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest ) => {

  const {getUser} = getKindeServerSession();
  const user = await getUser();

  if(!user || (user.email !== `${process.env.VALID_EMAIL_ADMIN}` && user.email !== 'rufusfingerboards@gmail.com')) {
    return NextResponse.redirect("https://rufus-fingerboard.vercel.app/")
  }

  await connectDB();

  const formData = await req.json();

  const existingCategory = await Category.findOne({
    category_name: formData.category_name,
  });

  if(existingCategory) {
    return new NextResponse(
      JSON.stringify({error: "Category already exists"}),
      {status: 400}
    );
  }

  if(!formData.category_name) {
    return new NextResponse(
      JSON.stringify({error: "Category name is required"}),
      {status: 400}
    );
  }

  const newCategory = new Category({
    category_name: formData.category_name?.toLowerCase() ?? "",
    category_title: formData.category_name,
    category_image: formData.category_image
  });

  await newCategory.save();

  return new NextResponse(
    JSON.stringify({message: "Category created successfully"}),
    {status: 200}
  );

}

export const GET = async () => {
  try {

    await connectDB();

    const categories = await Category.find({});

    return new NextResponse(
      JSON.stringify(categories),
      {status: 200}
    );

  } catch(err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({error: "Something went wrong"}),
      {status: 500}
    );
  }
}