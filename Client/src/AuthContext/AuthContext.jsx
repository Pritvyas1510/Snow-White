import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create a preconfigured axios instance for auth calls
  const api = axios.create({
    baseURL: "http://localhost:5000/auth",
    withCredentials: true,
  });

  // Create a preconfigured axios instance for other API calls
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
  });

  // Utility: extract a user object from any backend auth response shape
  const extractUser = (data) => {
    if (!data) return null;
    if (data.user) return data.user;
    if (data.sanitized) return data.sanitized;
    return data;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/check-auth");
        const userData = extractUser(response.data);
        console.log("Auth check response:", userData);
        if (userData && userData._id) {
          localStorage.setItem("userId", userData._id);
          setUser(userData);
          await refreshCart();
        } else {
          localStorage.removeItem("userId");
          setUser(null);
          setCartItems([]);
        }
      } catch (error) {
        console.error("Auth check error:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        if (error.response?.status === 401) {
          localStorage.removeItem("userId");
          setUser(null);
          setCartItems([]);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      const userData = extractUser(response.data);
      console.log("Login response:", userData);
      if (userData && userData._id) {
        localStorage.setItem("userId", userData._id);
        setUser(userData);
        await refreshCart();
      } else {
        throw new Error("No user ID in login response");
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const response = await api.post("/signup", {
        name,
        email,
        password,
        isAdmin: role === "admin",
      });
      const userData = extractUser(response.data);
      console.log("Signup response:", userData);
      if (userData && userData._id) {
        localStorage.setItem("userId", userData._id);
        setUser(userData);
        await refreshCart();
      } else {
        throw new Error("No user ID in signup response");
      }
      return response.data;
    } catch (error) {
      console.error("Signup error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } finally {
      localStorage.removeItem("userId");
      setUser(null);
      setCartItems([]);
    }
  };

  const refreshCart = async () => {
    if (user && user._id) {
      try {
        const response = await axiosInstance.get(`/cart/user/${user._id}`);
        setCartItems(response.data || []);
      } catch (err) {
        console.error("Failed to refresh cart:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setCartItems([]);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        cartItems,
        setCartItems,
        refreshCart,
        loading,
        axiosInstance, // Add axiosInstance to context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
