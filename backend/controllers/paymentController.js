const crypto = require("crypto");
const Order = require("../models/Order");

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ status: "failure", message: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("Signature Verification:", {
      expectedSignature,
      razorpay_signature,
    });

    if (expectedSignature === razorpay_signature) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: "Confirmed" },
        { new: true }
      );
      return res.json({ status: "success" });
    } else {
      return res
        .status(400)
        .json({ status: "failure", message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res
      .status(500)
      .json({
        status: "failure",
        message: "Error verifying payment, please try again later",
      });
  }
};
