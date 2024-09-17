import { connectDB } from "@/config/mongo-connect";
import { stripe } from "@/config/stripe";
import Cart from "@/lib/models/Cart";
import Order from "@/lib/models/Order";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("Checkout session completed", session);

      await connectDB();

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      // Fetch and store the product images
      const enrichedLineItems = await Promise.all(
        lineItems.data.map(async (item) => {
          const product = await stripe.products.retrieve(
            item.price?.product as string
          );
          return {
            ...item,
            productImages: product.images, // Add the images to each line item
          };
        })
      );

      const order = await Order.create({
        status: session.status,
        amount: session.amount_total as number,
        userId: session.metadata?.userId,
        address: session.shipping_details,
        userDetails: session.customer_details,
        orderId: session.id,
        lineItems: enrichedLineItems,
      });

      await order.save();

      await Cart.findOneAndDelete({ userId: session.metadata?.userId });
      break;
    }
    default: {
      console.log(`Unhandled event type ${event.type}`);
    }
  }

  return NextResponse.json(null, { status: 200 });
}
