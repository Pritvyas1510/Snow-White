require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Route files
const authRoutes = require("./routes/Auth");
const productRoutes = require("./routes/Product");
const orderRoutes = require("./routes/Order");
const cartRoutes = require("./routes/Cart");
const brandRoutes = require("./routes/Brand");
const categoryRoutes = require("./routes/Category");
const userRoutes = require("./routes/User");
const addressRoutes = require("./routes/Address");
const reviewRoutes = require("./routes/Review");
const wishlistRoutes = require("./routes/Wishlist");
const paymentRoutes = require('./routes/paymentRoutes')

// Database
const { connectToDB } = require("./database/db");

// Server init
const server = express();

// Connect to MongoDB
connectToDB();

// Log ORIGIN for debugging
console.log("CORS Origin:", process.env.ORIGIN);

// CORS Setup
server.use(
  cors({
    origin: process.env.ORIGIN.replace(/\/$/, ""), // Remove trailing slash
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);

// Session Middleware
server.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key", // Add SESSION_SECRET to .env
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // Your MongoDB connection string from .env
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use true in production with HTTPS
      sameSite: "lax", // Allows cookies to be sent in cross-origin requests
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

server.use(express.json());
server.use(cookieParser());
server.use(morgan("dev"));

// Routes
server.use("/auth", authRoutes);
server.use("/users", userRoutes);
server.use("/products", productRoutes);
server.use("/orders", orderRoutes);
server.use("/cart", cartRoutes);
server.use("/brands", brandRoutes);
server.use("/categories", categoryRoutes);
server.use("/address", addressRoutes);
server.use("/reviews", reviewRoutes);
server.use("/wishlist", wishlistRoutes);
server.use("/payment", paymentRoutes);
// Root test
server.get("/", (req, res) => {
  res.status(200).json({ message: "API Running ✅" });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});