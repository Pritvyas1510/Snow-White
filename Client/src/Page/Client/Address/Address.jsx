import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../AuthContext/AuthContext";
import axiosInstance from "../../../Axios/AxiosInstance";
import { useRazorpay } from "react-razorpay";

const razorpayKey = "rzp_test_VQhEfe2NCXbbwI";

const Address = () => {
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    phoneNumber: "",
    postalCode: "",
    country: "",
    type: "Home",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("COD");
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const navigate = useNavigate();
  const { Razorpay, isLoading, error } = useRazorpay();

  useEffect(() => {
    if (isLoggedIn) {
      fetchAddresses();
      fetchCartItems();
    } else {
      setAddresses([]);
      setCartItems([]);
    }
  }, [user]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/address/user/${user._id}`);
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddress(response.data[0]._id);
      }
    } catch (err) {
      toast.error(`Failed to fetch addresses: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/cart/user/${user._id}`);
      setCartItems(response.data);
    } catch (err) {
      toast.error(`Failed to fetch cart: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.warn("Please log in to add an address", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/address", {
        ...newAddress,
        user: user._id,
      });
      setAddresses((prev) => [...prev, response.data]);
      setSelectedAddress(response.data._id);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        phoneNumber: "",
        postalCode: "",
        country: "",
        type: "Home",
      });
      setShowAddressForm(false);
      toast.success("Address added successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`Failed to add address: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axiosInstance.delete(`/address/${addressId}`);
      setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
      if (selectedAddress === addressId) {
        setSelectedAddress(addresses.length > 1 ? addresses[0]._id : null);
      }
      toast.success("Address deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`Failed to delete address: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const getTotal = () =>
    cartItems
      .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
      .toFixed(2);

  const handlePaymentSuccess = async (response) => {
    try {
      const verifyResponse = await axiosInstance.post("/payment/verify", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
      if (verifyResponse.data.status === "success") {
        await axiosInstance.delete(`/cart/user/${user._id}`);
        setCartItems([]);
        setRazorpayOrder(null);
        toast.success("Order placed successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        // Wait 1 second and go to shop
        setTimeout(() => {
          navigate("/shop");
        }, 1000);
      } else {
        toast.error("Payment verification failed. Please contact support.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error(`Failed to process payment: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      toast.warn("Please log in to place order", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!selectedAddress) {
      toast.warn("Please select a delivery address", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const orderData = {
        user: user._id,
        item: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        address: addresses.find((addr) => addr._id === selectedAddress),
        paymentMode,
        total: parseFloat(getTotal()),
      };

      const response = await axiosInstance.post("/orders", orderData);

      if (paymentMode === "Razorpay" && response.data.order_id) {
        setRazorpayOrder({
          order_id: response.data.order_id,
          amount: response.data.amount,
          currency: response.data.currency,
        });

        const options = {
          key: razorpayKey,
          amount: response.data.amount,
          currency: response.data.currency,
          name: "Snow White",
          description: "Order Payment",
          order_id: response.data.order_id,
          handler: (response) => handlePaymentSuccess(response),
          prefill: {
            name: user.name,
            email: user.email || "",
            contact: user.phoneNumber || orderData.address.phoneNumber || "",
          },
          theme: {
            color: "#2563eb",
          },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      } else if (paymentMode === "COD") {
        await axiosInstance.delete(`/cart/user/${user._id}`);
        setCartItems([]);
        toast.success("Order placed successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/shop");
        }, 1000);
      } else {
        toast.error("Invalid payment mode or missing Razorpay order details", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error(`Failed to place order: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    navigate("/shop"); // Only close modal, navigate to shop manually
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">Place Order</h3>
          <button
            className="text-2xl font-bold text-gray-500 hover:text-gray-800 relative z-50"
            onClick={handleClose}
            aria-label="Close checkout"
          >
            ×
          </button>
        </div>

        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          {/* Left Column: User & Address */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">User Details</h4>
            {isLoggedIn ? (
              <div className="mb-6 p-4 border rounded-md border-gray-300">
                <p className="text-sm font-semibold text-gray-800">Name: {user.name}</p>
                {user.email && <p className="text-sm text-gray-600">Email: {user.email}</p>}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-6">Please log in to view user details.</p>
            )}

            <h4 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h4>
            {loading ? (
              <p className="text-gray-500">Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <p className="text-gray-500">No addresses found.</p>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`p-4 border rounded-md ${
                      selectedAddress === address._id ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      id={address._id}
                      name="address"
                      checked={selectedAddress === address._id}
                      onChange={() => setSelectedAddress(address._id)}
                      className="mr-2"
                    />
                    <label htmlFor={address._id} className="text-sm">
                      <p className="font-semibold">{address.type}</p>
                      <p>{address.street}, {address.city}, {address.state}</p>
                      <p>{address.postalCode}, {address.country}</p>
                      <p>Phone: {address.phoneNumber}</p>
                    </label>
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="text-sm text-red-500 hover:text-red-700 mt-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="mt-4 text-sm text-blue-500 hover:text-blue-700 font-semibold"
            >
              {showAddressForm ? "Cancel" : "Add New Address"}
            </button>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="mt-4 space-y-4">
                {/* Address Form Fields */}
                {["street","city","state","phoneNumber","postalCode","country"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                      type="text"
                      name={field}
                      value={newAddress[field]}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    value={newAddress.type}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Address
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Order Summary & Payment */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h4>
            {loading ? (
              <p className="text-gray-500">Loading cart...</p>
            ) : cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.thumbnail?.url || "https://via.placeholder.com/64"}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <h5 className="text-gray-800 font-semibold">{item.product.title}</h5>
                        <p className="text-sm text-gray-500">{item.quantity} × ₹{item.product.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Brand: {item.product.brand?.name || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="text-gray-800 font-semibold">₹{(item.quantity * item.product.price).toFixed(2)}</div>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-lg font-bold text-gray-800">₹{getTotal()}</span>
                </div>
              </div>
            )}

            <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Payment Mode</h4>
            <div className="space-y-2">
              {["COD","Razorpay"].map((mode) => (
                <label key={mode} className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMode"
                    value={mode}
                    checked={paymentMode === mode}
                    onChange={() => setPaymentMode(mode)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{mode === "COD" ? "Cash on Delivery (COD)" : "Razorpay (Card/UPI)"}</span>
                </label>
              ))}
            </div>

            {paymentMode === "Razorpay" && (
              <div className="mt-4">
                {isLoading && <p className="text-gray-500">Loading Razorpay...</p>}
                {error && <p className="text-red-500">Error loading Razorpay: {error.message}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-6">
          <button
            onClick={handlePlaceOrder}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition duration-200 shadow-md disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0 || !isLoggedIn || !selectedAddress || razorpayOrder}
          >
            {isLoggedIn ? "Place Order" : "Login to Place Order"}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Address;
