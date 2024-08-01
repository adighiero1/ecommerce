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
            
                    // Update last_connection field
             found.last_connection = new Date();
             await found.save();

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
    

    async  userLogout(req, res, next) {
        try {
            const token = req.cookies.coderCookieToken;
            if (!token) {
                return res.redirect("/login");
            }
    
            // Decode the token to get the user's information
            const decoded = jwt.verify(token, "coderhouse");
            const userId = decoded.user._id;
    
            // Find the user by ID and update the last_connection field
            const user = await UserModel.findById(userId);
            if (user) {
                user.last_connection = new Date();
                await user.save();
            }
    
            // Clear the cookie and redirect
            res.clearCookie("coderCookieToken");
            res.redirect("/login");
        } catch (error) {
            next(error);
        }
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
        res.status(500).send("Error interno del servidor");//comment
    }
    

}





// async changeMyRole(req, res) {
//     try {
//         const { uid, role } = req.body; // Get userId and newRole from request body

//         // Log the values to check if they are correct
//         console.log('Changing role for user ID:', uid, 'to role:', role);

//         if (!role || (role !== 'user' && role !== 'premium' && role !== 'admin')) {
//             return res.status(400).json({ success: false, message: 'Invalid role provided' });
//         }

//         // Logic to update the user's role in the database
//         const updatedUser = await User.findByIdAndUpdate(uid, { role }, { new: true });

//         if (!updatedUser) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         res.status(200).json({ success: true, message: 'User role updated successfully', user: updatedUser });
//     } catch (error) {
//         console.error('Error changing role:', error); // Log the detailed error
//         res.status(500).json({ success: false, message: 'Error changing role' });
//     }
// }

// async changeMyRole(req, res) {
//     try {
//         const { uid, role } = req.body; // Get userId and newRole from request body

//         // Log the values to check if they are correct
//         console.log('Changing role for user ID:', uid, 'to role:', role);

//         if (!role || (role !== 'user' && role !== 'premium' && role !== 'admin')) {
//             return res.status(400).json({ success: false, message: 'Invalid role provided' });
//         }

//         // Logic to update the user's role in the database
//         const updatedUser = await User.findByIdAndUpdate(uid, { role }, { new: true });

//         if (!updatedUser) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         res.status(200).json({ success: true, message: 'User role updated successfully', user: updatedUser });
//     } catch (error) {
//         console.error('Error changing role:', error); // Log the detailed error
//         res.status(500).json({ success: false, message: 'Error changing role' });
//     }
// }

async changeMyRole(req, res) {
    try {
        const { uid, role } = req.body; // Get userId and newRole from request body

        // Log the values to check if they are correct
        console.log('Changing role for user ID:', uid, 'to role:', role);

        if (!role || (role !== 'user' && role !== 'premium' && role !== 'admin')) {
            return res.status(400).json({ success: false, message: 'Invalid role provided' });
        }

        // Fetch the user to check documents
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the documents array is not empty
        if (!user.documents || user.documents.length === 0) {
            return res.status(400).json({ success: false, message: 'User has not uploaded any documents' });
        }

        // Logic to update the user's role in the database
        const updatedUser = await User.findByIdAndUpdate(uid, { role }, { new: true });

        res.status(200).json({ success: true, message: 'User role updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error changing role:', error); // Log the detailed error
        res.status(500).json({ success: false, message: 'Error changing role' });
    }
}





async uploadDocuments(req, res, next) {
    try {
        console.log("uploadDocuments called");

        // Log the user ID
        const uid = req.user._id;
        console.log("UserID:", uid);

        // Log the request files
        const documents = req.files.documents;
        console.log("Files in request:", documents);

        // Check if files are properly populated
        if (!documents || documents.length === 0) {
            console.log("No files uploaded or files are not populated correctly.");
            return res.status(400).json({ status: 'error', error: 'No files uploaded' });
        }

        // Find user by UID
        const user = await UserModel.findById(uid);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        // Log user details
        console.log("User found:", user);

        // Delete previous documents
        user.documents = [];

        // Prepare and save the uploaded documents
        const savedDocuments = documents.map(file => ({
            name: file.originalname,
            reference: file.path
        }));

        // Log documents to be saved
        console.log("Documents to save:", savedDocuments);

        user.documents.push(...savedDocuments);
        await user.save();

        console.log("Documents uploaded successfully");

        res.redirect('/api/users/profile');
    } catch (error) {
        console.log("Error uploading documents:", error);
        res.status(500).json({ status: 'error', error: 'Unknown error' });
    }
}



    async changeRoleToPremium(req, res, next) {
        const { uid } = req.params;

        try {
            const user = await UserModel.findById(uid);

            if (!user) {
                return res.status(404).send('User not found');
            }

            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];

            const hasAllDocuments = requiredDocuments.every(doc =>
                user.documents.some(userDoc => userDoc.name === doc)
            );

            if (!hasAllDocuments) {
                return res.status(400).send('User must upload all required documents to become premium');
            }

            user.role = 'premium';
            await user.save();

            res.status(200).send('User role updated to premium');
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req,res){
        try {
            const users = await userRepository.getAllUsers();
            const plainUsers = users.map(user => user.toObject());
            res.render('users', { plainUsers });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async cleanupInactiveUsers(req, res, next) {
        try {
            const now = new Date();
            const twoDaysAgo = new Date(now.getTime() -24 * 60 * 60 * 1000);

            console.log(`Current time: ${now}`);
            console.log(`Cutoff date: ${twoDaysAgo}`);

            const inactiveUsers = await UserRepository.findInactiveSince(twoDaysAgo);
            console.log(`Inactive users: ${JSON.stringify(inactiveUsers, null, 2)}`);

            if (inactiveUsers.length > 0) {
                const deletedUsers = await UserRepository.deleteUsersByIds(
                    inactiveUsers.map(user => user._id)
                );
                console.log(`Deleted users count: ${deletedUsers.deletedCount}`);

                for (const user of inactiveUsers) {
                    await emailManager.sendAccountDeletionNotification(user.email, user.first_name, user.last_name);
                }
                return res.status(200).json({ message: `Deleted ${deletedUsers.deletedCount} inactive users` });
            } else {
                console.log('No inactive users found to delete');
                return res.status(200).json({ message: 'No inactive users found to delete' });
            }
        } catch (error) {
            console.error('Error during cleanupInactiveUsers:', error);
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        const { id } = req.params;

        try {
            const deletedUser = await userRepository.deleteUser(id);

            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ message: "User deleted successfully", user: deletedUser });
        } catch (error) {
            console.error("Error deleting user:", error);
            next(new CustomError({
                name: "DeleteUserError",
                cause: `Error occurred while deleting user with ID: ${id}`,
                message: error.message,
                code: EErrors.SERVER_ERROR
            }));
        }
    }
    

}







module.exports = UserController;
