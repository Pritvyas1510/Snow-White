import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../AuthContext/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// ✅ Import icons
import { Settings, Package, Truck, CheckCircle } from "lucide-react";

const statusSteps = [
  { name: "Processing", icon: Settings },
  { name: "Dispatched", icon: Package },
  { name: "Out for delivery", icon: Truck },
  { name: "Completed", icon: CheckCircle },
];

const Order = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(null);
  const navigate = useNavigate();

  // Fetch all orders for admin
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders");

        // Remove completed & cancelled orders from this page
        const activeOrders = res.data.filter(
          (o) => o.status !== "Completed" && o.status !== "Cancelled"
        );

        // Fetch user details for each order
        const withUsers = await Promise.all(
          activeOrders.map(async (order) => {
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
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [axiosInstance]);

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.patch(`/orders/${orderId}`, { status: newStatus });
      toast.success(`Order updated to ${newStatus}`);

      if (newStatus === "Completed" || newStatus === "Cancelled") {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      {/* Top Header: Always visible */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Manage Orders</h1>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/admincomplateorder")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Completed Orders
          </button>
          <button
            onClick={() => navigate("/admincancleorder")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cancelled Orders
          </button>
        </div>
      </div>

      {/* Orders Section */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600 animate-pulse">Loading Orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500 text-lg">No active orders found.</p>
        </div>
      ) : (
        orders.map((order) => {
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
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    {progressPercent.toFixed(0)}%
                  </p>
                </div>
              </div>

              {/* Progress bar with icons */}
              <div className="relative mb-10">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
                <div
                  className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 transition-all duration-700 ease-in-out"
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
                              ? "bg-blue-600 text-white scale-110 shadow-md"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <p
                          className={`mt-2 text-xs transition-colors duration-700 ${
                            isActive ? "text-blue-600 font-semibold" : "text-gray-500"
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

              {/* Order Summary + Status Button */}
              <div className="border-t pt-4 flex justify-between items-center">
                <div>
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

                <div>
                  {order.status === "Processing" && (
                    <button
                      onClick={() =>
                        setConfirmModal({
                          orderId: order._id,
                          newStatus: "Dispatched",
                        })
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Dispatch
                    </button>
                  )}
                  {order.status === "Dispatched" && (
                    <button
                      onClick={() =>
                        setConfirmModal({
                          orderId: order._id,
                          newStatus: "Out for delivery",
                        })
                      }
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.status === "Out for delivery" && (
                    <button
                      onClick={() =>
                        setConfirmModal({
                          orderId: order._id,
                          newStatus: "Completed",
                        })
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Status Update</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to update this order to{" "}
              <span className="font-semibold">{confirmModal.newStatus}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  updateOrderStatus(confirmModal.orderId, confirmModal.newStatus);
                  setConfirmModal(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Yes, Update
              </button>
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
