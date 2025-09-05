import React, { useState } from "react";
import axiosInstance from "../../Axios/AxiosInstance";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // Toastify

const ManageProduct = () => {
  const initialState = {
    title: "",
    description: "",
    price: "",
    discountPercentage: 0,
    category: "",
    brand: "",
    stockQuantity: "",
    thumbnail: null,
    images: [],
  };

  const [formData, setFormData] = useState(initialState);
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileInputResetKey, setFileInputResetKey] = useState(Date.now());

  // ---------------- handlers ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "thumbnail") {
      setFormData((p) => ({ ...p, thumbnail: files[0] || null }));
    } else if (name === "images") {
      setFormData((p) => ({ ...p, images: Array.from(files || []) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("price", String(parseFloat(formData.price) || 0));
      fd.append(
        "discountPercentage",
        String(parseFloat(formData.discountPercentage) || 0)
      );
      fd.append("category", formData.category);
      fd.append("brand", formData.brand);
      fd.append(
        "stockQuantity",
        String(parseInt(formData.stockQuantity, 10) || 0)
      );

      if (formData.thumbnail) {
        fd.append("thumbnail", formData.thumbnail);
      }
      if (formData.images.length) {
        formData.images.forEach((img) => fd.append("images", img));
      }

      await axiosInstance.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully!");
      setFormData(initialState);
      setFileInputResetKey(Date.now());
    } catch (err) {
      console.error("Add product error:", err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- render ----------------
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Manage Products
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product title"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter price"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Enter product description"
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount Percentage (Optional)
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter discount percentage"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter stock quantity"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Fruit"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Apple"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thumbnail
            </label>
            <input
              key={fileInputResetKey + "-thumb"}
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Images (Gallery)
            </label>
            <input
              key={fileInputResetKey + "-images"}
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 text-white font-semibold rounded-lg ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition duration-300`}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>

        {/* Show/Hide Products */}
        <Link to="/showallproduct">
          <button
            disabled={loading}
            className={`mt-8 w-full p-3 text-white font-semibold rounded-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700"
            } transition duration-300`}
          >
            Show All Product
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ManageProduct;
