const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");
const UserRepository= require("../repositories/user.repository.js");
const userRepository= new UserRepository();
const CustomError = require("../utils/errors/custom-error.js");
const generateUserErrorInfo = require("../utils/errors/info.js");
const EErrors= require("../utils/errors/enum.js");

class UserController {
    // async registerUser(req, res) {//register
    //     const { first_name, last_name, email, password, age } = req.body;
    //     try {
    //         const thisuser = await UserModel.findOne({ email });
    //         if (thisuser) {
    //             return res.status(400).send("Try another user. This one already exists");
    //         }
    
            
    //         const newcart = new CartModel();
    //         await newcart.save();
    
    //         const newuser = new UserModel({
    //             first_name,
    //             last_name,
    //             email,
    //             cart: newcart._id, 
    //             password: createHash(password),
    //             age
    //         });
    
    //         await newuser.save();
    
    //         const token = jwt.sign({ user: newuser }, "coderhouse", {
    //             expiresIn: "1h"
    //         });
    
    //         res.cookie("coderCookieToken", token, {
    //             maxAge: 3600000,
    //             httpOnly: true
    //         });
    
    //         res.redirect("/api/users/profile");
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send("Internal server error");
    //     }
    // }

    async registerUser(req, res, next) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
          
            if (!first_name || !last_name || !email || !password || !age) {
                throw CustomError.createError({
                    nname: "User Registration Error",
                    ccause: generateUserErrorInfo({first_name, last_name, email,password}),
                    message:"error creating a user",
                    ccode: EErrors.MISSING_FIELDS
                });
            }

            const thisuser = await UserModel.findOne({ email });
            if (thisuser) {
                throw CustomError.createError({
                    name: "DuplicateUserError",
                    cause: `User with email ${email} already exists`,
                    message: "User already exists",
                    code: EErrors.DUPLICATE_USER
                });
            }

            const newcart = new CartModel();
            await newcart.save();

            const newuser = new UserModel({
                first_name,
                last_name,
                email,
                cart: newcart._id,
                password: createHash(password),
                age
            });

            await newuser.save();

            const token = jwt.sign({ user: newuser }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            next(error);
        }
    }
    
    async loginUser(req, res) {
        const { email, password } = req.body;
        try {
            const found = await UserModel.findOne({ email });
    
            if (!found) {
                return res.status(401).send("Invalid user");
            }
    
            const esValido = isValidPassword(password, found);
            if (!esValido) {
                return res.status(401).send("Password was not correct");
            }
    
            const token = jwt.sign({ user: found }, "coderhouse", {
                expiresIn: "1h"
            });
    
            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });
    
            res.redirect("/api/users/profile");
        } catch (error) {
            next(error);
        }
    }
    
    async userProfile(req, res) {
        
        const userInfo = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const admin = req.user.role === 'admin';
        res.render("profile", { user: userInfo, admin });
    }
    
    async userLogout(req, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }
    
    async isadmin(req, res) {
        try {
            if (!req.user || req.user.role !== "admin") {
                return res.status(403).send("Access denied.");
            }
            res.render("admin");
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    

}








module.exports = UserController;
