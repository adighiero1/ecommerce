const ProductModel = require("../models/product.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const logger = require("../utils/logger.js");
const path = require('path');
const fs = require('fs');
const ProductRepository= require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
class ViewsController {

    // getRandomImage = () => {
    //     const imagesPath = path.join(__dirname, '..', 'public', 'images');
    //     const imageFiles = fs.readdirSync(imagesPath);
    //     const randomIndex = Math.floor(Math.random() * imageFiles.length);
    //     return imageFiles[randomIndex];
    // }

    // async getProducts(req, res) {
    //     try {
    //         const { page = 1, limit = 6 } = req.query;
    //         const skip = (page - 1) * limit;

    //         const products = await ProductModel.aggregate([
    //             { $skip: skip },
    //             { $limit: parseInt(limit) },
    //             { $addFields: { id: { $toString: "$_id" } } },
    //             { $project: { _id: 0, id: 1, title: 1, description: 1, price: 1, img: 1 } } // Explicitly project required fields
    //         ]);
    //         req.logger.info("Fetched products:", { products});
    //         // console.log("Fetched products:", products);

    //         const totalProducts = await ProductModel.countDocuments();
    //         const totalPages = Math.ceil(totalProducts / limit);
    //         const hasPrevPage = page > 1;
    //         const hasNextPage = page < totalPages;

    //         res.render("products", {
    //             products,
    //             hasPrevPage,
    //             hasNextPage,
    //             prevPage: hasPrevPage ? parseInt(page) - 1 : null,
    //             nextPage: hasNextPage ? parseInt(page) + 1 : null,
    //             currentPage: parseInt(page),
    //             totalPages,
    //             cartId: req.user.cart.toString()
    //         });

    //     } catch (error) {
    //         // console.error("Error fetching products", error);
    //         req.logger.error("Error fetching products", { error });
    //         res.status(500).json({
    //             status: 'error',
    //             error: "Internal server error"
    //         });
    //     }
    // }
    
    
    
    async getProducts(req, res) {
        try {
            const { page = 1, limit = 6 } = req.query;
            const skip = (page - 1) * limit;

            // Fetch products from the database
            const products = await ProductModel.aggregate([
                { $skip: skip },
                { $limit: parseInt(limit) },
                { $addFields: { id: { $toString: "$_id" } } },
                { $project: { _id: 0, id: 1, title: 1, description: 1, price: 1 } } // Explicitly project required fields
            ]);

            // Log the fetched products
            req.logger.info("Fetched products:", { products });

            // Define getRandomImage function within getProducts method
            const getRandomImage = () => {
                const imagesPath = path.join(__dirname, '..', 'public', 'images');
                const imageFiles = fs.readdirSync(imagesPath);
                if (imageFiles.length === 0) {
                    return 'filter.jpg'; // Use a default image
                }
                const randomIndex = Math.floor(Math.random() * imageFiles.length);
                const selectedImage = imageFiles[randomIndex];
                return selectedImage || 'default.jpg'; // Ensure a valid image is always returned
            };

            // Attach a random image to each product
            products.forEach(product => {
                const randomImage = getRandomImage();
                console.log(`Assigning image ${randomImage} to product ${product.id}`); // Log image assignment
                product.image = `/images/${randomImage}`;
            });

            // Log products with images
            console.log('Products with images:', products);

            // Calculate pagination information
            const totalProducts = await ProductModel.countDocuments();
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            // Render the products view with pagination info
            res.render("products", {
                products,
                hasPrevPage,
                hasNextPage,
                prevPage: hasPrevPage ? parseInt(page) - 1 : null,
                nextPage: hasNextPage ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId: req.user.cart.toString()
            });

        } catch (error) {
            // Log the error and respond with an error message
            req.logger.error("Error fetching products", { error });
            res.status(500).json({
                status: 'error',
                error: "Internal server error"
            });
        }
    }
   

    async getCart(req, res) {
        const cartId = req.params.cid;
        try {
            const carrito = await cartRepository.getCartProducts(cartId);
    
            if (!carrito) {
                req.logger.warn("Cart does not exist", { cartId });
                return res.status(404).json({ error: "Cart was not found" });
            }
    
            let totalCompra = 0;
    
            const productosEnCarrito = [];
            for (const item of carrito.products) {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;
                totalCompra += totalPrice;
                productosEnCarrito.push({
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                });
            }
    
            res.render("carts", { productos: productosEnCarrito, totalCompra, cartId });
        } catch (error) {
            req.logger.error("Error getting the cart", { error });
            // console.error("Error getting the cart", error);
            res.status(500).json({ error: "Server Error" });
        }
    }


    async getLogin(req, res) {
        req.logger.info("Rendering login page");
        res.render("login");
    }
    async getCheckout(req,res){
        req.logger.info("Rendering checkout page");
        res.render("/checkout");   
    }
    async getRegister(req, res) {
        req.logger.info("Rendering register page");
        res.render("register");
    }

    async getRealtimeProducts(req, res) {
        try {
            req.logger.info("Rendering realtime products page");
            res.render('realtimeproducts', {
                userRole: req.user.role, // Assuming req.user contains the logged-in user information
                userEmail: req.user.email // Assuming req.user contains the logged-in user information
            });
        } catch (error) {
            console.log("Error", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getChat(req, res) {
        req.logger.info("Rendering chat page");
        res.render("chat");
    }

    async getDocuments(req,res){
        const uid = req.user._id;
        console.log("Received UID:", uid);
        req.logger.info("Rendering documents page");
        res.render("uploaddocuments",{userId:uid});
    }

    async getHome(req, res) {
        res.render("home");
    }

    async getPasswordChange(req,res){ 
        res.render("passwordchange");
    }

    async getPasswordReset(req,res){
        res.render("passwordreset");
    }

    async getEmailConfirmation(req,res){
        res.render("emailconfirmation");
    }

    async getChangeRole(req,res){
        res.render("rolechange", { user: req.user });
    }
    // async getSearch(req,res){
    //     res.render("searchresults");
    // }

    // async getSearch(req, res) {
    //     const { query } = req.query;
    //     const cartId = req.user.cart; // Access cart ID from authenticated user
    
    //     try {
    //         console.log("Received search query:", query);
    //         const products = await productRepository.searchProducts(query);
    //         console.log("Search results fetched:", products);
    //         console.log("Cart ID:", cartId);
    
    //         res.render("searchresults", {
    //             products,
    //             query,
    //             cartId
    //         });
    //     } catch (error) {
    //         console.error("Error searching for products:", error.message);
    //         res.status(500).json({
    //             status: 'error',
    //             error: "Internal server error"
    //         });
    //     }
    // }

    // async getSearch(req, res) {
    //     const { query } = req.query;
    //     const cartId = req.user ? req.user.cart : null; // Use cart ID if authenticated, else set to null
        
    //     try {
    //         console.log("Received search query:", query);
    //         const products = await productRepository.searchProducts(query);
    //         console.log("Search results fetched:", products);
    //         console.log("Cart ID:", cartId);
        
    //         res.render("searchresults", {
    //             products,
    //             query,
    //             cartId
    //         });
    //     } catch (error) {
    //         console.error("Error searching for products:", error.message);
    //         res.status(500).json({
    //             status: 'error',
    //             error: "Internal server error"
    //         });
    //     }
    // }

    // async getSearch(req, res) {
    //     const { query = '', page = 1, limit = 6 } = req.query;
    //     const skip = (page - 1) * limit;
    //     const cartId = req.user ? req.user.cart : null; // Use cart ID if authenticated, else set to null
    
    //     try {
    //         console.log("Received search query:", query);
    
    //         // Define getRandomImage function
    //         const getRandomImage = () => {
    //             const imagesPath = path.join(__dirname, '..', 'public', 'images');
    //             const imageFiles = fs.readdirSync(imagesPath);
    //             if (imageFiles.length === 0) {
    //                 return 'default.jpg'; // Use a default image
    //             }
    //             const randomIndex = Math.floor(Math.random() * imageFiles.length);
    //             return imageFiles[randomIndex] || 'default.jpg'; // Ensure a valid image is always returned
    //         };
    
    //         // Search products with pagination
    //         const products = await productRepository.searchProducts(query, skip, limit);
    //         console.log("Search results fetched:", products);
    //         console.log("Cart ID:", cartId);
    
    //         // Attach a random image to each product
    //         products.forEach(product => {
    //             const randomImage = getRandomImage();
    //             console.log(`Assigning image ${randomImage} to product ${product.id}`); // Log image assignment
    //             product.image = `/images/${randomImage}`;
    //         });
    
    //         // Count total number of search results
    //         const totalProducts = await ProductModel.countDocuments({
    //             $text: { $search: query }
    //         });
    //         const totalPages = Math.ceil(totalProducts / limit);
    //         const hasPrevPage = page > 1;
    //         const hasNextPage = page < totalPages;
    
    //         // Render the search results view with pagination info
    //         res.render("searchresults", {
    //             products,
    //             query,
    //             hasPrevPage,
    //             hasNextPage,
    //             prevPage: hasPrevPage ? parseInt(page) - 1 : null,
    //             nextPage: hasNextPage ? parseInt(page) + 1 : null,
    //             currentPage: parseInt(page),
    //             totalPages,
    //             cartId
    //         });
    
    //     } catch (error) {
    //         // Log the error and respond with an error message
    //         console.error("Error searching for products:", error.message);
    //         req.logger.error("Error searching for products", { error });
    //         res.status(500).json({
    //             status: 'error',
    //             error: "Internal server error"
    //         });
    //     }
    // }
    
    // async getSearch(req, res) {
    //     const { query = '', page = 1, limit = 6 } = req.query;
    //     const skip = (page - 1) * limit;
    //     const cartId = req.user ? req.user.cart : null; // Use cart ID if authenticated, else set to null
    
    //     try {
    //         console.log("Received search query:", query);
    //         console.log("Pagination values:", { page, limit, skip });
    
    //         // Define getRandomImage function
    //         const getRandomImage = () => {
    //             const imagesPath = path.join(__dirname, '..', 'public', 'images');
    //             const imageFiles = fs.readdirSync(imagesPath);
    //             if (imageFiles.length === 0) {
    //                 return 'default.jpg'; // Use a default image
    //             }
    //             const randomIndex = Math.floor(Math.random() * imageFiles.length);
    //             return imageFiles[randomIndex] || 'default.jpg'; // Ensure a valid image is always returned
    //         };
    
    //         // Search products with pagination
    //         const products = await productRepository.searchProducts(query, skip, limit);
    //         console.log("Search results fetched:", products);
    //         console.log("Cart ID:", cartId);
    
    //         // Attach a random image to each product
    //         products.forEach(product => {
    //             const randomImage = getRandomImage();
    //             console.log(`Assigning image ${randomImage} to product ${product.id}`); // Log image assignment
    //             product.image = `/images/${randomImage}`;
    //         });
    
    //         // Count total number of search results
    //         const totalProducts = await ProductModel.countDocuments({
    //             $text: { $search: query }
    //         });
    //         const totalPages = Math.ceil(totalProducts / limit);
    //         const hasPrevPage = page > 1;
    //         const hasNextPage = page < totalPages;
    
    //         // Log pagination info
    //         console.log("Pagination Info:", {
    //             hasPrevPage,
    //             hasNextPage,
    //             prevPage: hasPrevPage ? page - 1 : null,
    //             nextPage: hasNextPage ? page + 1 : null,
    //             currentPage: page,
    //             totalPages
    //         });
    
    //         // Render the search results view with pagination info
    //         res.render("searchresults", {
    //             products,
    //             query,
    //             hasPrevPage,
    //             hasNextPage,
    //             prevPage: hasPrevPage ? page - 1 : null,
    //             nextPage: hasNextPage ? page + 1 : null,
    //             currentPage: page,
    //             totalPages,
    //             cartId
    //         });
    
    //     } catch (error) {
    //         // Log the error and respond with an error message
    //         console.error("Error searching for products:", error.message);
    //         req.logger.error("Error searching for products", { error });
    //         res.status(500).json({
    //             status: 'error',
    //             error: "Internal server error"
    //         });
    //     }
    // }

    async getSearch(req, res) {
        const { query = '', page = 1, limit = 6 } = req.query;
        const skip = (page - 1) * limit;
        const cartId = req.user ? req.user.cart : null;
    
        try {
            console.log("Received search query:", query);
            console.log("Pagination values:", { page, limit, skip });
    
            const getRandomImage = () => {
                const imagesPath = path.join(__dirname, '..', 'public', 'images');
                const imageFiles = fs.readdirSync(imagesPath);
                if (imageFiles.length === 0) {
                    return 'default.jpg';
                }
                const randomIndex = Math.floor(Math.random() * imageFiles.length);
                return imageFiles[randomIndex] || 'default.jpg';
            };
    
            const products = await productRepository.searchProducts(query, skip, limit);
            console.log("Search results fetched:", products);
            console.log("Cart ID:", cartId);
    
            products.forEach(product => {
                const randomImage = getRandomImage();
                console.log(`Assigning image ${randomImage} to product ${product.id}`);
                product.image = `/images/${randomImage}`;
            });
    
            const totalProducts = await ProductModel.countDocuments({
                $text: { $search: query }
            });
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            
            const paginationInfo = {
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevPage: page > 1 ? pageNum - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                currentPage: page,
                totalPages
            };

            console.log("Pagination Info:", {
                hasPrevPage,
                hasNextPage,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                currentPage: page,
                totalPages
            });
    
            res.render("searchresults", {
                products,
                query,
                ...paginationInfo,
                cartId
            });
    
        } catch (error) {
            console.error("Error searching for products:", error.message);
            req.logger.error("Error searching for products", { error });
            res.status(500).json({
                status: 'error',
                error: "Internal server error"
            });
        }
    }
    
    
    
    
}

module.exports = ViewsController;
