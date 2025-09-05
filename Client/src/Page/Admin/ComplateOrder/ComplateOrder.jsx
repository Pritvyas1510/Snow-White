import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../AuthContext/AuthContext";
import { toast } from "react-toastify";

// ✅ Import icons
import { Settings, Package, Truck, CheckCircle } from "lucide-react";

const statusSteps = [
  { name: "Processing", icon: Settings },
  { name: "Dispatched", icon: Package },
  { name: "Out for delivery", icon: Truck },
  { name: "Completed", icon: CheckCircle },
];

const ComplateOrder = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders");
        // ✅ Only show completed orders
        const completedOrders = res.data.filter(
          (o) => o.status === "Completed"
        );

        // Fetch user details
        const withUsers = await Promise.all(
          completedOrders.map(async (order) => {
            try {
              const userRes = await axiosInstance.get(`/users/${order.user}`);
              return { ...order, userDetails: userRes.data };
            } catch (err) {
              console.error("Failed to fetch user", err);
              return { ...order, userDetails: null };
            }
          })
        );

        setOrders(withUsers);
      } catch (error) {
        console.error("Failed to fetch completed orders:", error);
        toast.error("Failed to load completed orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [axiosInstance]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 animate-pulse">
          Loading Completed Orders...
        </p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No completed orders found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Completed Orders
      </h1>

      {orders.map((order) => {
        const currentStepIndex = statusSteps.findIndex(
          (s) => s.name === order.status
        );
        const progressPercent =
          currentStepIndex >= 0
            ? ((currentStepIndex + 1) / statusSteps.length) * 100
            : 0;

        return (
          <div
            key={order._id}
            className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-6"
          >
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-all">
                  Order #{order._id}
                </h2>
                <p className="text-gray-500 text-sm">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
                {order.userDetails && (
                  <p className="text-sm text-gray-700 mt-1">
                    👤 {order.userDetails.name} | {order.userDetails.email}
                  </p>
                )}
              </div>
              <div className="text-left sm:text-right">
                <p className="text-gray-600 font-medium">Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {progressPercent.toFixed(0)}%
                </p>
              </div>
            </div>

            {/* ✅ Progress bar with icons */}
            <div className="relative mb-10">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 transition-all duration-700 ease-in-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
              <div className="flex justify-between relative z-10">
                {statusSteps.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.name}
                      className="flex flex-col items-center text-center w-full"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ${
                          isActive
                            ? "bg-green-600 text-white scale-110 shadow-md"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <p
                        className={`mt-2 text-xs transition-colors duration-700 ${
                          isActive
                            ? "text-green-600 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {step.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
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

            {/* Order Summary */}
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
        );
      })}
    </div>
  );
};

export default ComplateOrder;
