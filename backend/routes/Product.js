// routes/product.js
const express = require("express");
const upload = require("../config/multerConfig");
const productController = require("../controllers/Product");

const router = express.Router();

// const productMediaUpload = upload.fields([
//   { name: "thumbnail", maxCount: 1 },
//   { name: "images", maxCount: 10 },
// ]);

router
  .post("/", upload, productController.create)
  .get("/", productController.getAll)
  .get("/:id", productController.getById)
  .patch("/undelete/:id", productController.undeleteById) // no upload
  .patch("/:id", upload, productController.updateById)
  .delete("/:id", productController.deleteById);

module.exports = router;
