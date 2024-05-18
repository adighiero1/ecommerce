const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const authMiddleware = require("../middleware/authmiddleware.js");
const cartController = new CartController();

router.use(authMiddleware);

router.post("/", cartController.createCart);
router.get("/:cid", cartController.getCartProducts);
router.post("/:cid/product/:pid", cartController.addProduct);
router.delete('/:cid/product/:pid', cartController.deleteProduct);
router.put('/:cid', cartController.updateCart);
router.put('/:cid/product/:pid', cartController.updateQuantity);
router.delete('/:cid', cartController.emptyCart);
router.post('/:cid/purchase', cartController.checkout);


module.exports = router;
