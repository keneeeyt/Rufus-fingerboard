import { connectDB } from "@/config/mongo-connect";
import { stripe } from "@/config/stripe";
import Cart from "@/lib/models/Cart";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { Stripe } from "stripe";


export const POST = async() => {
  try{
    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if(!user) {
      return NextResponse.redirect("/");
    }

    await connectDB();


    let cart = await Cart.findOne({ userId: user.id }) || null; //eslint-disable-line

    if(cart || cart.items) {

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item: any) => (
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              description: item.description,
              images: [item.imageString],
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity
        }
      ))

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        success_url: 'http://localhost:3000/payment/success',
        cancel_url: 'http://localhost:3000/payment/cancel',
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU', 'PH'],
        },
        metadata: {
          userId: user.id
        }
      })

      return NextResponse.json(session.url, {status: 200})
    }

   
  }catch(err){
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}