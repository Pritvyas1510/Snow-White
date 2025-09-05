import React, { useContext, useState, useEffect } from "react";
import { FaHeart, FaShoppingBag, FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";
import Cart from "./Cart";
import { AuthContext } from "../AuthContext/AuthContext";
import { navLinks } from "../Data/Navbar";
import axiosInstance from "../Axios/AxiosInstance";

const Navbar = ({ favorites = [] }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const role = user?.role || "guest";

  useEffect(() => {
    if (isLoggedIn) {
      const fetchCartItems = async () => {
        try {
          const response = await axiosInstance.get(`/cart/user/${user._id}`);
          setCartItems(response.data || []);
        } catch (err) {
          console.error("Failed to fetch cart:", err);
          setCartItems([]);
        }
      };
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [user, isLoggedIn]);

  const refreshCart = () => {
    if (isLoggedIn) {
      const fetchCartItems = async () => {
        try {
          const response = await axiosInstance.get(`/cart/user/${user._id}`);
          setCartItems(response.data || []);
        } catch (err) {
          console.error("Failed to refresh cart:", err);
          setCartItems([]);
        }
      };
      fetchCartItems();
    }
  };

  const getTotal = () =>
    cartItems
      .reduce(
        (acc, item) => acc + (item?.product?.price * item?.quantity || 0),
        0
      )
      .toFixed(2);

  return (
    <>
      <header className="z-50 w-full relative">
        {/* Top Strip */}
        <div className="bg-green-700 text-white text-sm py-2 px-4 flex justify-between items-center">
          <p>Welcome to our online store!</p>
          <div>
            {!user ? (
              <>
                <Link to="/login" className="underline ml-1">
                  Login
                </Link>
                <span className="mx-2">|</span>
                <Link to="/signup" className="underline ml-1">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <span className="mr-4">Hello, {user.name}</span>
                <button onClick={logout} className="underline ml-1">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-white shadow-sm">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-2xl font-bold text-yellow-400"
          >
            <img
              src="/Image/white snow (3).png"
              className="h-12 w-auto mr-2"
              alt="Logo"
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 mx-6 max-w-xl w-full">
            <input
              type="text"
              placeholder="Find Product..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6 text-sm text-lime-600">
            {isLoggedIn && (
              <>
                {/* Favorites Icon */}
                <Link
                  to="/favorites"
                  className="relative flex items-center gap-2"
                >
                  <FaHeart className="text-xl text-red-500" />
                  <span>{favorites.length} Item(s)</span>
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                {/* Orders Icon */}
                <Link
                  to="/myorders"
                  className="relative flex items-center gap-2"
                  aria-label="My Orders"
                >
                  <FaClipboardList className="text-xl text-blue-600" />
                  <span>My Orders</span>
                </Link>

                {/* Cart Icon */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center cursor-pointer gap-2"
                  aria-label="Open cart"
                >
                  <FaShoppingBag className="text-xl text-gray-700" />
                  <span>Cart</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-2 text-xs bg-emerald-500 text-white rounded-full px-1">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Nav */}
        <nav className="bg-white shadow-sm border-t">
          <div className="flex items-center justify-center px-6 py-3 gap-6 overflow-x-auto text-sm font-semibold uppercase text-gray-700">
            {navLinks[role].map((link, index) => (
              <Link key={index} to={link.path} className="hover:text-green-600">
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <Cart
          cartItems={cartItems}
          setCartItems={setCartItems}
          onClose={() => setIsCartOpen(false)}
          onCartUpdate={refreshCart}
        />
      )}
    </>
  );
};

export default Navbar;
