import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Orders = () => {
  const { user, axiosInstance } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      const fetchOrders = async () => {
        try {
          const response = await axiosInstance.get(`/orders/user/${user._id}`);
          setOrders(response.data);
          setError(null);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
          setError(
            error.response?.status === 404
              ? "Orders endpoint not found. Please check backend configuration."
              : "Failed to load orders. Please try again later."
          );
          toast.error(error.message || "Failed to fetch orders");
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user, axiosInstance]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500 font-medium text-lg bg-white p-6 rounded-lg shadow-md">
          Please login to view your orders
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600 font-medium text-lg animate-pulse">
          Loading your orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500 font-medium text-lg bg-white p-6 rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  // ✅ Active orders (hide Completed + Cancelled)
  const activeOrders = orders.filter(
    (order) => order.status !== "Completed" && order.status !== "Cancelled"
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Top Bar with Completed Orders Button */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/complatedorder")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Completed Orders
          </button>

          <h2 className="text-3xl font-bold text-gray-800 text-center flex-1">
            My Orders
          </h2>
        </div>

        {activeOrders.length === 0 ? (
          <div className="text-center text-gray-500 font-medium bg-white p-6 rounded-lg shadow-md">
            You have no active orders.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {activeOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold text-gray-800">
                    Order ID: <span className="text-gray-900">{order._id}</span>
                  </p>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-600"
                        : order.status === "Dispatched"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Payment */}
                <div className="text-sm text-gray-600 mb-4">
                  Payment Mode:{" "}
                  <span className="font-medium text-gray-800">
                    {order.paymentMode}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-4 border-t pt-4">
                  {order.item.map((itm, idx) => (
                    <Link
                      key={idx}
                      to={`/orderdetails/${order._id}`}
                      className="block"
                    >
                      <div className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                        <img
                          src={
                            itm.product?.thumbnail?.url ||
                            itm.product?.images?.[0]?.url ||
                            "https://via.placeholder.com/64"
                          }
                          alt={itm.product?.title || "Product"}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {itm.product?.title || "Product"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {itm.quantity} | Price: ₹{itm.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 text-right">
                  <p className="text-lg font-semibold text-gray-800">
                    Total: ₹{order.total}
                  </p>
                </div>

                {/* Address */}
                <div className="mt-3 text-sm text-gray-600">
                  Delivery Address:{" "}
                  <span className="font-medium text-gray-800">
                    {order.address?.street}, {order.address?.city},{" "}
                    {order.address?.state} - {order.address?.postalCode},{" "}
                    {order.address?.country}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
