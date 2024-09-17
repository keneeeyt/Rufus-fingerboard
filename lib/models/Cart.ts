import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
     type: String,
    },
    items: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true, // Each item should be linked to a product
        },
        name: {
          type: String,
          required: true,
          trim: true, // Trims extra spaces
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1, // Set a default quantity for each item
        },
        imageString: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;
