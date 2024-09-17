import mongoose from "mongoose";

const ProductSchema  = new mongoose.Schema({
 product_name: {
    type: String,
    required: true
  },
  product_description: {
    type: String,
    required: true
  },
  product_price: {
    type: Number,
    required: true
  },
  product_status: {
    type: String,
    required: true
  },
  isFeatured: {
    type: Boolean,
  },
  product_images: {
    type: Array,
  },
  product_category: {
    type: String,
  },
}, {timestamps: true})

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;