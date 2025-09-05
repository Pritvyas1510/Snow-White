import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../AuthContext/AuthContext";
import { toast } from "react-toastify";

const CompletedOrders = () => {
  const { user, axiosInstance } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(`/orders/user/${user._id}`);
        const completed = response.data.filter(
          (order) => order.status === "Completed"
        );
        setOrders(completed);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load completed orders");
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchOrders();
  }, [user, axiosInstance]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 animate-pulse">Loading Completed Orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          ✅ Completed Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">
            No completed orders found.
          </p>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Order #{order._id}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg shadow">
                    ✅ Completed Order
                  </span>
                </div>

                {/* Order items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Products</h3>
                  <div className="space-y-4">
                    {order.item.map((itm, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 border rounded-lg p-3 hover:shadow-sm transition"
                      >
                        <img
                          src={
                            itm.product?.thumbnail?.url ||
                            itm.product?.images?.[0]?.url ||
                            "https://via.placeholder.com/64"
                          }
                          alt={itm.product?.title}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {itm.product?.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {itm.quantity} × ₹{itm.price}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ₹{itm.quantity * itm.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order summary */}
                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm">
                    Delivery Address:{" "}
                    <span className="font-medium text-gray-800">
                      {order.address?.street}, {order.address?.city},{" "}
                      {order.address?.state} - {order.address?.postalCode},{" "}
                      {order.address?.country}
                    </span>
                  </p>
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    Total: ₹{order.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedOrders;
