const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController(); 

router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);
router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/", productController.addProduct);


module.exports = router;