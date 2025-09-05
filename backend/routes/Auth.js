const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth");
const { authMiddleware } = require("../middleware/VerifyToken");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/check-auth", authMiddleware, authController.checkAuth);

module.exports = router;
