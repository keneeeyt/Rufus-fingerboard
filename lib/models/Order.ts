import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({
  status: {
    type: String,
    default: "pending"
  },
  amount: {
    type: Number,
  },
  userId: {
    type: String,
  },
  delivery_status: {
    type: String,
    default: "processing"
  },
  address: {
    type: Object
  },
  userDetails: {
    type: Object,
  },
  lineItems: {
    type: Array,
  },
  orderId: {
    type: String,
  },
  tracking_number: {
    type: String,
    default: ""
  },
  shipping_company: {
    type: String,
    default: ""
  }
},{timestamps: true})

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;