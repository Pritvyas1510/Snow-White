const  Wishlist = require( "../models/Wishlist.js");
const  Product = require("../models/Product.js");

// Toggle add/remove
exports.toggle = async (req, res) => {
  try {
    const { user, product } = req.body;
    if (!user || !product) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const existing = await Wishlist.findOne({ user, product });

    if (existing) {
      await existing.deleteOne();
      return res.json({ removed: true });
    } else {
      const newWishlist = await Wishlist.create({ user, product });
      return res.json(newWishlist);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all wishlist for a user
exports.getByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Wishlist.find({ user: id }).populate({
      path: "product",
      populate: ["brand"],
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};
