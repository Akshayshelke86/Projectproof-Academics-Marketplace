import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectID,
      required: true,
      ref: 'User',
    },
    affiliateUser: { // The user who referred this specific sale
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    orderItems: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        project: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_Address: { type: String },
      razorpay_payment_id: { type: String },
      razorpay_order_id: { type: String },
      razorpay_signature: { type: String }
    },
    price: {
      type: Number,
      required: true,
      default: 0.0
    },
    paidAt: {
      type: Date
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema)

export default Order