import { connectDB } from "@/config/mongo-connect";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async ({}, { params }: { params: { productId: any } }) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find the cart by userId, not cart ID
    let cart = await Cart.findOne({ userId: user.id }) || null; // eslint-disable-line

    const selectedProduct = await Product.findById(params.productId);

    if (!selectedProduct) {
      return NextResponse.json({ message: "No product with this id" }, { status: 404 });
    }

    // Create new cart if none exists for the user
    if (!cart || !cart.items) {
      cart = new Cart({
        userId: user.id,
        items: [
          {
            id: selectedProduct._id, // Use _id if that's the field in Product
            name: selectedProduct.product_name, // Use correct field names
            price: selectedProduct.product_price,
            imageString: selectedProduct.product_images[0], // Assuming images is an array
            quantity: 1
          }
        ]
      });

      await cart.save();
    } else {
      // Check if the item already exists in the cart
      const existingItem = cart.items.find((item: any) => item.id.toString() === selectedProduct._id.toString());

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({
          id: selectedProduct._id,
          name: selectedProduct.product_name,
          price: selectedProduct.product_price,
          imageString: selectedProduct.product_images[0], // Assuming images is an array
          quantity: 1
        });
      }

      await cart.save();
    }

    revalidatePath("/");

    return NextResponse.json("Product added to cart", { status: 200 });

  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


export const DELETE = async (req: NextRequest, { params }: { params: { productId: any } }) => {
  try{
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if(!user){
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    await connectDB();

    let cart = await Cart.findOne({ userId: user.id }) || null; //eslint-disable-line

    if(!cart || !cart.items){
      return NextResponse.json("Cart is empty", { status: 200 });
    }

    const selectedProduct = await Product.findById(params.productId);

    if(!selectedProduct){
      return NextResponse.json("No product with this id", { status: 404 });
    }

    const existingItem = cart.items.find((item: any) => item.id.toString() === selectedProduct._id.toString());

    if(existingItem){
      if(existingItem.quantity > 1){
        existingItem.quantity -= 1;
      }else{
        cart.items = cart.items.filter((item: any) => item.id.toString() !== selectedProduct._id.toString());
      }

      await cart.save();
    }

    revalidatePath("/");

    return NextResponse.json("Product removed from cart", { status: 200 });
  }catch(err){
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
