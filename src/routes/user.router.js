const express = require("express");
const router = express.Router();
const multer = require("multer");
const passport = require("passport");
const upload = require('../middleware/multer')
const UserController = require("../controllers/user.controller.js");
const checkUserRole = require("../middleware/checkrole.js");
const userController = new UserController();
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.isadmin);
router.get('/users', checkUserRole(['admin']), passport.authenticate('jwt', { session: false }), userController.getUsers);
router.post("/register", userController.registerUser);

// router.get("/products", checkUserRole(['user','premium']), passport.authenticate('jwt', { session: false }), viewsController.getProducts);


router.post("/login", userController.loginUser);
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.userProfile);
router.post("/logout", userController.userLogout);
router.post("/passwordreset",userController.resetPasswordRequest);
router.post("/resetpassword",userController.passwordReset);
// router.patch("/change-my-role", passport.authenticate("jwt", { session: false }), userController.changeMyRole);
router.post("/change-my-role", passport.authenticate("jwt", { session: false }), userController.changeMyRole); // Changed to POST
router.delete('/cleanup-inactive',checkUserRole(['admin']), passport.authenticate('jwt', { session: false }), userController.cleanupInactiveUsers);

// Endpoint to upload documents
// router.post('/:uid/documents', upload.array('documents'), (req, res, next) => userController.uploadDocuments(req, res, next));
router.post('/:uid/documents', passport.authenticate("jwt", { session: false }), upload.fields([{name:'documents'}]), (req, res, next) => {
    console.log("Document upload route hit");
    console.log("UserID:", req.user ? req.user._id : 'No user found'); // Use req.user._id
    console.log("Files:", req.files);
    userController.uploadDocuments(req, res, next);
});
// Endpoint to update user role to premium
router.patch('/premium/:uid', (req, res, next) => userController.changeRoleToPremium(req, res, next));


module.exports = router;

