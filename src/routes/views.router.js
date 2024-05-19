const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");
router.get("/carts/:cid", viewsController.getCart);
router.get("/login", viewsController.getLogin);
router.get("/register", viewsController.getRegister);
router.get("/products", checkUserRole(['user']),passport.authenticate('jwt', { session: false }), viewsController.getProducts);
router.get("/realtimeproducts", checkUserRole(['admin']), viewsController.getRealtimeProducts);
router.get("/chat", checkUserRole(['user']) ,viewsController.getChat);
router.get("/", viewsController.getHome);



module.exports = router;

