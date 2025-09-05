const express = require("express");
const wishlistController = require("../controllers/Wishlist");
const router = express.Router();

router.post("/toggle", wishlistController.toggle);   // ❤️ add/remove
router.get("/user/:id", wishlistController.getByUserId);

module.exports = router;
