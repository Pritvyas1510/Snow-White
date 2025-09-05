const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // snapshot of product details (so we can show info even if product changes/deletes)
    productDetails: {
      title: String,
      thumbnail: String,
      price: Number,
      category: String,
    },
    note: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
      default: true, // always true when added, can be toggled later
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
