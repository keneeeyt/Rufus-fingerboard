import { connectDB } from "@/config/mongo-connect";
import Product from "@/lib/models/Product";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Create a new product (POST)
export const POST = async (req: NextRequest) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== process.env.VALID_EMAIL_ADMIN) {
    return NextResponse.redirect("/", 302);
  }

  await connectDB();

  const formData = await req.json();

  const existingProduct = await Product.findOne({
    product_name: formData.product_name,
  });

  if (existingProduct) {
    return new NextResponse(
      JSON.stringify({ error: "Product already exists" }),
      { status: 400 }
    );
  }

  if (!formData.product_name || !formData.product_images) {
    return new NextResponse(
      JSON.stringify({ error: "Product name and images are required" }),
      { status: 400 }
    );
  }
  

  const newProduct = new Product({
    product_name: formData.product_name,
    isFeatured: formData.isFeatured,
    product_description: formData.product_description,
    product_price: formData.product_price,
    product_images: formData.product_images,
    product_category: formData.product_category ?? "",
    product_status: formData.product_status,
  });

  await newProduct.save();

  return new NextResponse(
    JSON.stringify({ message: "Product created successfully" }),
    { status: 200 }
  );
};

// Get all products (GET)
export const GET = async (req: NextRequest) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user === null || !user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectDB();

    const products = await Product.find().sort({ createdAt: "desc" });

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("Error retrieving products", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


