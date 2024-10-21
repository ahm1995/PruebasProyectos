const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");

productRouter.post("/", productController.createProduct);
productRouter.get("/", productController.getProducts);
productRouter.get("/:id", productController.getProductBtId);

module.exports = productRouter;
