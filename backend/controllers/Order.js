const Order = require("../models/Order");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.create = async (req, res) => {
  try {
    const { user, item, address, paymentMode, total } = req.body;

    // Validate required fields
    if (!user || !item || !address || !paymentMode || !total) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Handle Razorpay order for Razorpay payment mode
    let razorpayOrderId = null;
    let order_id = null;
    let amount = null;
    let currency = null;
    if (paymentMode === "Razorpay") {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(total * 100), // Convert to paise for INR
        currency: "INR",
        receipt: `order_rcptid_${user}`,
      });
      console.log('Razorpay Order:', razorpayOrder);
      razorpayOrderId = razorpayOrder.id;
      order_id = razorpayOrder.id;
      amount = razorpayOrder.amount;
      currency = razorpayOrder.currency;
    }

    // Create the order
    const order = new Order({
  user,
  item,
  address,
  paymentMode,
  total,
  razorpayOrderId,
  paymentStatus: paymentMode === "COD" ? "Confirmed" : "Pending", // COD = auto confirmed
  status: "Processing", // delivery flow starts
});


    await order.save();
    res.status(201).json({ order, order_id, amount, currency });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Error creating order, please try again later" });
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await Order.find({ user: id })
      .populate("item.product")   // <-- populate product details
      .exec();
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Error fetching orders, please try again later" });
  }
};

exports.getById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("item.product"); // populate product details

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};


exports.getAll = async (req, res) => {
  try {
    let skip = 0;
    let limit = 0;

    if (req.query.page && req.query.limit) {
      const pageSize = parseInt(req.query.limit);
      const page = parseInt(req.query.page);
      skip = pageSize * (page - 1);
      limit = pageSize;
    }

    const totalDocs = await Order.countDocuments().exec();
    const results = await Order.find({})
      .populate("item.product")  // ✅ populate product details
      .skip(skip)
      .limit(limit)
      .exec();

    res.header("X-Total-Count", totalDocs);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders, please try again later" });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // --- Business rules ---
    // If user is trying to cancel
    if (status === "Cancelled") {
      if (order.status !== "Processing") {
        return res.status(400).json({
          message: "Order cannot be cancelled once it is dispatched or out for delivery",
        });
      }
    }

    // If admin sets Out for delivery or Dispatched, allow
    if (["Dispatched", "Out for delivery", "Completed"].includes(status)) {
      order.status = status;
    }

    // If status is Cancelled (and allowed above)
    if (status === "Cancelled" && order.status === "Processing") {
      order.status = "Cancelled";
    }

    // Save changes
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order, please try again later" });
  }
};

