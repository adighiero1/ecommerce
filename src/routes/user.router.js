const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");

const userController = new UserController();
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.isadmin);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.userProfile);
router.post("/logout", userController.userLogout);


module.exports = router;

