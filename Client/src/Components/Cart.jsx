import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../AuthContext/AuthContext";
import axiosInstance from "../Axios/AxiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

const Cart = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.search.includes("refresh=true")) {
      fetchCartItems();
    }
  }, [location]);

  useEffect(() => {
    if (isLoggedIn) fetchCartItems();
    else setCartItems([]);
  }, [user]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/cart/user/${user._id}`);
      setCartItems(response.data);
    } catch (err) {
      toast.error(`Failed to fetch cart: ${err.message}`, { position: "top-left", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (!isLoggedIn) {
      toast.warn("Please log in to update cart", { position: "top-left", autoClose: 3000 });
      return;
    }
    try {
      if (newQuantity === 0) {
        await axiosInstance.delete(`/cart/${cartItemId}`);
        toast.info("Item removed from cart", { position: "top-left", autoClose: 3000 });
      } else {
        const response = await axiosInstance.patch(`/cart/${cartItemId}`, { quantity: newQuantity });
        setCartItems(prev =>
          prev.map(item => (item._id === cartItemId ? { ...item, quantity: response.data.quantity } : item))
        );
      }
      fetchCartItems();
    } catch (err) {
      toast.error(`Failed to update cart: ${err.message}`, { position: "top-left", autoClose: 3000 });
    }
  };

  const handleClearCart = async () => {
    if (cartItems.length === 0) {
      toast.warn("Cart is already empty!", { position: "top-left", autoClose: 3000 });
      return;
    }
    if (!isLoggedIn) {
      setCartItems([]);
      toast.success("Cart cleared!", { position: "top-left", autoClose: 3000 });
      return;
    }
    try {
      await axiosInstance.delete(`/cart/user/${user._id}`);
      setCartItems([]);
      toast.success("Cart cleared!", { position: "top-left", autoClose: 3000 });
    } catch (err) {
      toast.error(`Failed to clear cart: ${err.message}`, { position: "top-left", autoClose: 3000 });
    }
  };

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-full sm:w-[400px] h-full bg-white shadow-xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">Your Cart</h3>
          <button
            className="text-2xl font-bold text-gray-500 hover:text-gray-800"
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4" id="cart-items">
          {loading ? (
            <p className="text-gray-500 text-center mt-10">Loading cart...</p>
          ) : cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
          ) : (
            <>
              <div className="flex justify-end">
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-500 hover:text-red-700 font-semibold"
                >
                  Clear Cart
                </button>
              </div>
              {cartItems.map(item => (
                <div key={item._id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.thumbnail?.url || "https://via.placeholder.com/64"}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="text-gray-800 font-semibold">{item.product.title}</h4>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × ₹{item.product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">Brand: {item.product.brand?.name || "Unknown"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          className="h-6 w-6 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          className="h-6 w-6 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                          disabled={item.quantity >= item.product.stockQuantity}
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, 0)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-800 font-semibold">₹{(item.quantity * item.product.price).toFixed(2)}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span className="text-lg font-bold text-gray-800">₹{getTotal()}</span>
            </div>
            <button
              onClick={() => navigate("/address")}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition duration-200 shadow-md disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
              disabled={cartItems.length === 0 || !isLoggedIn}
            >
              {isLoggedIn ? "Proceed to Order" : "Login to Place Order"}
            </button>
          </div>
        )}
      </div>
      <ToastContainer position="top-left" />
    </div>
  );
};

export default Cart;
