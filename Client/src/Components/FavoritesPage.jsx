import React, { useEffect, useState, useContext, useCallback } from "react";
import { Heart } from "lucide-react";
import { AuthContext } from "../AuthContext/AuthContext";
import axiosInstance from "../Axios/AxiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LOCAL_CART_KEY = "guestCartV1";

// Skeleton card for loading state (matching reference)
const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl bg-white p-4 border border-gray-100">
    <div className="h-44 w-full rounded-xl bg-gray-200 mb-4" />
    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
    <div className="h-3 w-1/2 bg-gray-200 rounded mb-3" />
    <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />
    <div className="h-9 w-full bg-gray-200 rounded" />
  </div>
);

// Product card component (adapted from reference, with consistent data types)
const ProductCard = ({
  product,
  handleAddToCart,
  handleUpdateQuantity,
  cartItems,
  isLoggedIn,
  user,
  handleToggleFavorite,
}) => {
  const hasDiscount = Number(product.discountPercentage) > 0;
  const discountedPrice = hasDiscount
    ? Number(product.price) * (1 - Number(product.discountPercentage) / 100)
    : Number(product.price);

  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const stockQty = Number(product.stockQuantity) || 0;

  const [isSelectingQuantity, setIsSelectingQuantity] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleQuantityConfirm = () => {
    if (selectedQuantity > 0 && selectedQuantity <= stockQty) {
      handleAddToCart(product, selectedQuantity, setIsSelectingQuantity);
    } else {
      toast.warn(`Please select a quantity between 1 and ${stockQty}`);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4">
      {/* Discount badge */}
      {hasDiscount && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-red-500/95 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          -{product.discountPercentage}%
        </span>
      )}

      {/* Favorite button (always filled since it's favorites page) */}
      <button
        onClick={() => handleToggleFavorite(product)}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 border border-gray-300 shadow-md hover:bg-gray-100 hover:scale-105 transition"
      >
        <Heart
          size={16}
          fill="red"
          stroke="red"
          strokeWidth={2}
        />
      </button>

      {/* Product image */}
      <div className="relative flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.thumbnail?.url ? (
          <img
            src={product.thumbnail.url}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-xs text-gray-400">No Image</span>
        )}
      </div>

      {/* Product details */}
      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900 group-hover:text-gray-800">
          {product.title}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="rounded-md bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
            {product.brand || "Brand"}
          </span>
          {stockQty <= 0 && (
            <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-700">
              Out of Stock
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-2">
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                ₹{discountedPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs line-through text-gray-500">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Cart controls */}
        {isSelectingQuantity ? (
          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={stockQty}
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Number(e.target.value))}
              className="w-16 rounded-lg border border-gray-200 px-2 py-2 text-sm text-center"
            />
            <button
              onClick={handleQuantityConfirm}
              className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition"
            >
              Confirm
            </button>
            <button
              onClick={() => setIsSelectingQuantity(false)}
              className="h-9 w-9 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              X
            </button>
          </div>
        ) : (
          <button
            onClick={() => stockQty > 0 && setIsSelectingQuantity(true)}
            className="mt-4 w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            disabled={stockQty <= 0}
          >
            {stockQty <= 0
              ? "Sold Out"
              : cartQuantity > 0
              ? "Add More"
              : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
};

const FavoritesPage = () => {
  const { user } = useContext(AuthContext);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);

  const isLoggedIn = !!user;
  const getUserId = () => user?._id || null;

  // Load guest cart from localStorage
  const loadGuestCart = () => {
    try {
      const raw = localStorage.getItem(LOCAL_CART_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = (mapObj) => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(mapObj));
    } catch (e) {
      toast.warn("Unable to save guest cart.");
    }
  };

  // Sync guest cart to server after login
  const syncGuestCartToServer = useCallback(async () => {
    if (!isLoggedIn || !user?._id) return;
    const guestCart = loadGuestCart();
    const guestItems = Object.entries(guestCart).map(([pid, qty]) => ({
      product: pid,
      quantity: Number(qty) || 1,
    }));
    if (guestItems.length === 0) return;

    try {
      for (const item of guestItems) {
        await axiosInstance.post("/cart", {
          user: user._id,
          product: item.product,
          quantity: item.quantity,
        });
      }
      localStorage.removeItem(LOCAL_CART_KEY);
      await fetchCartFromServer();
      toast.success("Guest cart synced to your account!");
    } catch (err) {
      toast.error(`Failed to sync guest cart: ${err.message}`);
    }
  }, [isLoggedIn, user]);

  // Hydrate guest cart with product details
  const hydrateGuestCart = useCallback(() => {
    const idQtyMap = loadGuestCart();
    const hydrated = Object.entries(idQtyMap)
      .map(([pid, qty]) => {
        const product = favoriteProducts.find((p) => p._id === pid);
        return product
          ? {
              _id: `guest-${pid}`,
              product,
              quantity: Number(qty) || 1,
              __guest: true,
            }
          : null;
      })
      .filter(Boolean);
    setCartItems(hydrated);
  }, [favoriteProducts]);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?._id) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }
      try {
        const { data } = await axiosInstance.get(`/wishlist/user/${user._id}`);
        setFavoriteProducts(data.map((item) => item.product));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  // Fetch cart from server for logged-in user
  const fetchCartFromServer = useCallback(async () => {
    if (!isLoggedIn || !user?._id) {
      setLoadingCart(false);
      return;
    }
    try {
      setLoadingCart(true);
      const { data } = await axiosInstance.get(`/cart/user/${user._id}`);
      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load cart.");
    } finally {
      setLoadingCart(false);
    }
  }, [isLoggedIn, user]);

  // Load cart based on auth status
  useEffect(() => {
    if (!loading) {
      if (isLoggedIn) {
        fetchCartFromServer();
        syncGuestCartToServer();
      } else {
        hydrateGuestCart();
      }
      setLoadingCart(false);
    }
  }, [loading, isLoggedIn, fetchCartFromServer, hydrateGuestCart, syncGuestCartToServer]);

  // Sync guest cart state to localStorage
  const syncGuestCartState = (updatedItems) => {
    const mapObj = updatedItems.reduce((acc, ci) => {
      if (ci.__guest && ci.product?._id) acc[ci.product._id] = ci.quantity;
      return acc;
    }, {});
    saveGuestCart(mapObj);
  };

  // Add to cart handler
  const handleAddToCart = async (product, quantity, setIsSelectingQuantity) => {
    const existingItem = cartItems.find(
      (item) => item.product._id === product._id
    );
    if (existingItem) {
      await handleUpdateQuantity(product._id, existingItem.quantity + quantity);
      toast.success(`${product.title} added to cart`);
      setIsSelectingQuantity(false);
      return;
    }

    if (!isLoggedIn) {
      const newItem = {
        _id: `guest-${product._id}`,
        product,
        quantity,
        __guest: true,
      };
      const updated = [...cartItems, newItem];
      setCartItems(updated);
      syncGuestCartState(updated);
      toast.success(`${product.title} added to cart`);
      setIsSelectingQuantity(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post("/cart", {
        user: getUserId(),
        product: product._id,
        quantity,
      });
      setCartItems((prev) => [...prev, data]);
      toast.success(`${product.title} added to cart`);
      setIsSelectingQuantity(false);
    } catch (err) {
      toast.error(`Failed to add ${product.title} to cart: ${err.message}`);
    }
  };

  // Update cart quantity handler
  const handleUpdateQuantity = async (productId, newQuantity) => {
    const cartItem = cartItems.find((item) => item.product._id === productId);
    if (!cartItem) return;

    if (!isLoggedIn || cartItem.__guest) {
      const updated =
        newQuantity <= 0
          ? cartItems.filter((i) => i.product._id !== productId)
          : cartItems.map((i) =>
              i.product._id === productId ? { ...i, quantity: newQuantity } : i
            );
      setCartItems(updated);
      syncGuestCartState(updated);
      return;
    }

    try {
      if (newQuantity <= 0) {
        await axiosInstance.delete(`/cart/${cartItem._id}`);
        setCartItems((prev) =>
          prev.filter((item) => item.product._id !== productId)
        );
      } else {
        const { data } = await axiosInstance.patch(`/cart/${cartItem._id}`, {
          quantity: newQuantity,
        });
        setCartItems((prev) =>
          prev.map((item) =>
            item.product._id === productId
              ? { ...item, quantity: data.quantity }
              : item
          )
        );
      }
    } catch (err) {
      toast.error(`Failed to update cart quantity: ${err.message}`);
    }
  };

  // Toggle favorite (since on favorites page, this will remove)
  const handleToggleFavorite = async (product) => {
    try {
      if (!isLoggedIn) {
        toast.info("Login to manage favorites permanently.");
        return;
      }

      const { data } = await axiosInstance.post("/wishlist/toggle", {
        user: user._id,
        product: product._id,
      });

      if (data.removed) {
        setFavoriteProducts((prev) => prev.filter((p) => p._id !== product._id));
        toast.info(`${product.title} removed from favorites`);
      } else {
        // Unlikely on favorites page, but handle
        toast.success(`${product.title} added to favorites`);
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
      console.error(err);
    }
  };

  const isLoading = loading || loadingCart;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading favorites...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Your Favorite Items
        </h2>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                handleAddToCart={handleAddToCart}
                handleUpdateQuantity={handleUpdateQuantity}
                cartItems={cartItems}
                isLoggedIn={isLoggedIn}
                user={user}
                handleToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center mt-16 space-y-4">
            <div className="bg-gray-100 p-6 rounded-full">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.828 0-3.41 1.01-4.312 2.505C11.098 4.76 9.516 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              You haven’t favorited anything yet
            </h3>
            <p className="text-gray-500 max-w-md text-sm">
              Start exploring our shop and click the ♥ icon on items you love.
              Your favorites will appear here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;