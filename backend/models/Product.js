// models/Product.js
const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },              // frontend field
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    stockQuantity: { type: Number, default: 0, min: 0 },

    // If using lookup collections:
    category: { type: String, required:true},
    brand: { type: String, required:true},

    // Cloudinary media
    thumbnail: {
      url: String,
      publicId: String,
    },
    images: [productImageSchema],

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
