import { connectDB } from "@/config/mongo-connect";
import Product from "@/lib/models/Product";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Get a single product by ID (GET with params)
export const GET = async (req: NextRequest, { params } : {params: {id: any}}) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user === null || !user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectDB();

    const { id } = params; // Extract the product ID from params

      // Check if the provided ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return new NextResponse("Product not found", { status: 404 });
      }

    const product = await Product.findById(id);

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.log("Error retrieving product by ID", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Update a product by ID (PUT)
export const PUT = async (req: NextRequest, { params }: { params: { id: any } }) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== process.env.VALID_EMAIL_ADMIN) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectDB();

    const { id } = params; // Extract the product ID from params
    const formData = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(id, formData, {
      new: true, // Return the updated product
    });

    if (!updatedProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.log("Error updating product by ID", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Delete a product by ID (DELETE)

export const DELETE = async (req: NextRequest, { params }: { params: { id: any } }) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== process.env.VALID_EMAIL_ADMIN) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectDB();

    const { id } = params; // Extract the product ID from params

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return new NextResponse("Product deleted successfully", { status: 200 });
  } catch (err) {
    console.log("Error deleting product by ID", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};