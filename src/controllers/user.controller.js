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
const tokenGenerator = require("../utils/tokengenerator.js");
const Email= require("../utils/email.js");
const User = require('../models/user.model.js'); // Adjust the path as necessary
const emailManager= new Email;
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

    // async passwordReset(req,res){
    //     const {token,email,password} = req.body;
    //     try{
    //         const user = await UserModel.findOne({email});
    //         if(!user){
    //             return res.render("user was not found");
    //         }
    //         const passwordToken= user.passwordToken;
    //         if(token!== passwordToken ||!passwordToken){
    //             console.log("Error here");
    //             return res.render("/passwordchange");
    //         }

    //         const date= new Date();
    //         if(date>passwordToken.expires){
    //             return res.redirect("/login");
    //         }

    //         if (isValidPassword(password, user)) {
    //             return res.render("passwordchange", { error: "It can't be the same password" });
    //         }
            
    //         user.password= createHash(password);
    //         user.passwordToken=undefined;
    //         await user.save();

    //         return res.redirect("/login");

    //     }catch(error){
    //         console.error(error);
    //         res.status(500).send("Internal Server Error");
    //     }
    // }

    async passwordReset(req, res) {
        const { token, email, password } = req.body;
        console.log("Received request:", { token, email, password }); // Log received request data
    
        try {
            const user = await UserModel.findOne({ email });
            console.log("User found:", user); // Log user found
    
            if (!user) {
                console.log("User not found");
                return res.render("user was not found");
            }
    
            const passwordToken = user.passwordToken;
            console.log("User's password token:", passwordToken); // Log user's password token
    
            if (!passwordToken) {
                console.log("Password token not found for user");
                return res.render("/passwordchange");
            }
    
            if (token !== passwordToken.token) {
                console.log("Token mismatch");
                return res.render("/passwordchange");
            }
    
            const date = new Date();
            console.log("Current date:", date); // Log current date
            console.log("Token expiry date:", passwordToken.expires); // Log token expiry date
    
            if (date > passwordToken.expires) {
                console.log("Token has expired");
                return res.redirect("/login");
            }
    
            if (isValidPassword(password, user)) {
                console.log("New password cannot be the same as the old one");
                return res.render("passwordchange", { error: "It can't be the same password" });
            }
    
            user.password = createHash(password);
            user.passwordToken = undefined;
            await user.save();
            console.log("Password updated successfully");
    
            return res.redirect("/login");
        } catch (error) {
            console.error("Error during password reset:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async resetPasswordRequest(req,res){
        const {email} = req.body;
        try{
            const user = await UserModel.findOne({email});
            if(!user){
                return res.status(404).send("User not found");
            }

            const token= tokenGenerator(8);
            //to save the token into the user
            user.passwordToken= {token,expires: new Date(Date.now() + 3600000)};
            await user.save();
            await emailManager.resetPassword(email,user.first_name,user.last_name,token);
            res.redirect("/emailconfirmation");
    
    

    }catch(error){
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
    

}

// async changeRole(req, res) {
//     const userId = req.params.userId;
//     try {
//         // Find the user by ID
//         const user = await User.findById(userId);

//         // Check if user exists
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Change the role
//         user.role = user.role === 'user' ? 'premium' : 'user';

//         // Save the updated user
//         await user.save();

//         return res.status(200).json({ message: 'User role updated successfully', user });
//     } catch (error) {
//         console.error('Error updating user role:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// }

async changeMyRole(req, res) {
    try {
        const userId = req.user._id; // Assuming the user ID is available in the JWT payload
        const newRole = req.body.role;

        if (!newRole || (newRole !== 'user' && newRole !== 'premium')) {
            return res.status(400).json({ success: false, message: 'Invalid role provided' });
        }

        // Logic to update the user's role in the database
        const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        
        res.redirect('/api/users/profile');
    } catch (error) {
        console.error('Error changing role:', error); // Log the detailed error
        res.status(500).json({ success: false, message: 'Error changing role' });
    }
}


}





module.exports = UserController;
