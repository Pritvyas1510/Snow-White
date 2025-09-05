import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../Axios/AxiosInstance";

const ShowAllProduct = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const resp = await axiosInstance.get("/products"); // Make sure this returns ALL (including isDeleted) or only active.
      let data = Array.isArray(resp.data)
        ? resp.data
        : resp.data.products || [];
      // Filter out soft deleted items on client (unless backend already excludes them)
      data = data.filter((p) => !p.isDeleted);
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      console.error("Fetch products error:", err);
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFiltered(products);
    } else {
      const q = searchQuery.toLowerCase();
      setFiltered(
        products.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.category?.name?.toLowerCase().includes(q) || // if populated objects
            p.category?.toLowerCase?.().includes(q) ||
            p.brand?.name?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase?.().includes(q) ||
            p.description?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, products]);

  return (
    <div className="mt-6">
      <div className="flex flex-col items-center gap-4 mb-6">
        <h3 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 tracking-tight">
          All Products
        </h3>
        <div className="w-full max-w-xl relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {products.length} products
        </p>
      </div>

      {error && (
        <div className="max-w-xl mx-auto mb-6 w-full border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-300 transition"
            >
              <div className="relative w-full h-66 overflow-hidden">
                <img
                  src={p.thumbnail?.url}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
                {p.category && (
                  <span className="absolute top-3 left-3 text-[11px] bg-white/90 px-2 py-1 rounded-full font-semibold text-gray-700 shadow">
                    {p.category.name || p.category}
                  </span>
                )}
                {p.brand && (
                  <span className="absolute top-3 right-3 text-[11px] bg-indigo-600 text-white px-2 py-1 rounded-full font-semibold shadow">
                    {p.brand.name || p.brand}
                  </span>
                )}
              </div>
              <div className="flex flex-col flex-1 p-5">
                <h4 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                  {p.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {p.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xl font-bold text-indigo-600">
                    ₹{Number(p.price).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    Stock: {p.stockQuantity}
                  </p>
                </div>
                <div className="mt-auto">
                  <Link
                    to={`/updateproduct/${p._id}`}
                    className="w-full inline-flex justify-center items-center text-sm font-medium px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[.98] transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowAllProduct;
