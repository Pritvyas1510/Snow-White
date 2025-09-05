import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../AuthContext/AuthContext";
import { toast } from "react-toastify";

// ✅ Icons
import { Settings, Package, Truck, CheckCircle } from "lucide-react";

const statusSteps = [
  { name: "Processing", icon: Settings },
  { name: "Dispatched", icon: Package },
  { name: "Out for delivery", icon: Truck },
  { name: "Completed", icon: CheckCircle },
];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axiosInstance } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false); // ✅ Modal state

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, axiosInstance]);

  // Cancel Order function
  const cancelOrder = async () => {
    try {
      const res = await axiosInstance.patch(`/orders/${order._id}`, {
        status: "Cancelled",
      });
      toast.success("Order cancelled successfully");
      setOrder(res.data);
      setShowCancelModal(false);
      setTimeout(() => navigate("/orders"), 1000);
    } catch (error) {
      console.error("Cancel order failed:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
      setShowCancelModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 animate-pulse">Loading Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Order not found.</p>
      </div>
    );
  }

  if (order.status === "Completed" || order.status === "Cancelled") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          This order is <span className="font-semibold">{order.status}</span>{" "}
          and is no longer available.
        </p>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.name === order.status);
  const progressPercent =
    currentStepIndex >= 0 ? ((currentStepIndex + 1) / statusSteps.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-all">
              Order #{order._id}
            </h2>
            <p className="text-gray-500 text-sm">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-gray-600 font-medium">Progress</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              {progressPercent.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Progress bar with Icons */}
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-700 ${
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
                  <p className="font-medium text-gray-800">{itm.product?.title}</p>
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

          {order.status === "Processing" && (
            <button
              onClick={() => setShowCancelModal(true)}
              className=" w-36 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* ✅ Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Are you sure?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Do you really want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={cancelOrder}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
