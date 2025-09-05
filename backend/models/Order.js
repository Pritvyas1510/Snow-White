const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    address: {
      type: Schema.Types.Mixed,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Processing",
        "Dispatched",
        "Out for delivery",
        "Completed",
        "Cancelled",
      ],
      default: "Processing",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Failed"],
      default: "Pending",
    },

    paymentMode: {
      type: String,
      enum: ["COD", "Razorpay"],
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);
