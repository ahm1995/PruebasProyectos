import express from "express";
import { createProduct, getProducts, getProductBtId } from "../controllers/productController.mjs"; // Asegúrate de que la extensión sea .mjs

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductBtId);

export default productRouter; // Exportar el router como exportación predeterminada
