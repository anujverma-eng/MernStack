const express = require("express");
const { getAllProducts, createProduct, updateProduct } = require("../controller/productController");

const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/products/new").post(createProduct);

router.route("/products/:id").put(updateProduct);

module.exports = router