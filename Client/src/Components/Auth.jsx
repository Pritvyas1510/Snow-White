import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { AuthContext } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);

  const [isSignup, setIsSignup] = useState(location.pathname === "/signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSignup(location.pathname === "/signup");
    setFormData({ name: "", email: "", password: "" });
  }, [location.pathname]);

  const switchMode = (mode) => {
    setIsSignup(mode === "signup");
    navigate(mode === "signup" ? "/signup" : "/login");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      toast.error("Invalid email format");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (isSignup && !formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isSignup) {
        await signup(formData.name, formData.email, formData.password, "user");
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        const response = await login(formData.email, formData.password);
        toast.success("Login successful!");
        const { role } = response.sanitized; 
        navigate(role === "admin" ? "/" : "/");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-[#f0fdf4] from-emerald-50 to-emerald-100 p-4">
      <div className="w-full max-w-4xl -mt-36 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col-reverse md:flex-row transition-all duration-500">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-emerald-500 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">
            {isSignup ? "Welcome Back!" : "Hello, Friend!"}
          </h2>
          <p className="text-sm mb-6 px-4">
            {isSignup
              ? "To stay connected with us please login with your personal info"
              : "Enter your details to start your journey with us"}
          </p>
          <button
            onClick={() => switchMode(isSignup ? "login" : "signup")}
            className="bg-white text-emerald-500 px-8 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md text-center space-y-4"
          >
            <h1 className="text-2xl font-bold mb-2">
              {isSignup ? "Create Account" : "Sign In"}
            </h1>

            <div className="flex justify-center space-x-3 text-lg text-gray-600">
              <a href="#" className="hover:text-blue-600">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-pink-500">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-black">
                <FaXTwitter />
              </a>
            </div>

            <p className="text-sm text-gray-500 mb-2">
              {isSignup
                ? "Or use your email to sign up"
                : "Or use your account"}
            </p>

            {isSignup && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            {!isSignup && (
              <div className="text-right text-sm text-emerald-500">
                <a href="#">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-full font-semibold transition disabled:opacity-50"
            >
              {isLoading ? "Loading..." : isSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
