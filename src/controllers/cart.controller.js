const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateCode, calculateTotal } = require("../utils/cartutils.js");
const CustomError = require("../utils/errors/custom-error.js");
const generateCartErrorInfo = require("../utils/errors/cartinfo.js");
const EErrors= require("../utils/errors/enum.js");



class CartController {
    async createCart(req, res) {
        try {
            const cart = await cartRepository.createCart();
            res.json(cart);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getCartProducts(req, res) {
        const cartid = req.params.cid;
        try {
            const products = await cartRepository.getCartProducts(cartid);
            if (!products) {
                return res.status(404).json({ error: "Cart not found" });
            }
            res.json(products);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    // async addProduct(req, res) {
    //     const cartId = req.params.cid;
    //     const productId = req.params.pid;
    //     const quantity = req.body.quantity || 1;
    //     try {
    //         await cartRepository.addProduct(cartId, productId, quantity);
    //         const cartID = (req.user.cart).toString();

    //         res.redirect(`/carts/${cartID}`)
    //     } catch (error) {
    //         res.status(500).send("Error");
    //     }
    // }

    ////////////////old one that worked/////////////
    // async addProduct(req, res, next) {
    //     const cartId = req.params.cid;
    //     const productId = req.params.pid;
    //     const quantity = req.body.quantity || 1;
        
    //     try {
    //         if (!cartId || !productId || !quantity) {
    //             console.log("Generating cart error info...");
    //             const cartErrorInfo = generateCartErrorInfo(productId, quantity);
    //             console.log("Cart error info:", cartErrorInfo);
    
    //             console.log("Throwing custom error...");
    //             throw CustomError.createError({
    //                 nname: "Cart Product Addition Error",
    //                 ccause: cartErrorInfo,
    //                 message: "Error adding product to cart",
    //                 ccode: EErrors.CART_MISSING_FIELDS
    //             });
    //         }
    
    //         await cartRepository.addProduct(cartId, productId, quantity);
    //         const cartID = (req.user.cart).toString();
    
    //         res.redirect(`/carts/${cartID}`);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    async addProduct(req, res, next) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    
    try {
        console.log("Received request to add product:");
        console.log("cartId:", cartId);
        console.log("productId:", productId);
        console.log("quantity:", quantity);

        if (!cartId || !productId || !quantity) {
            console.log("Generating cart error info...");
            const cartErrorInfo = generateCartErrorInfo(productId, quantity);
            console.log("Cart error info:", cartErrorInfo);

            console.log("Throwing custom error...");
            throw CustomError.createError({
                nname: "Cart Product Addition Error",
                ccause: cartErrorInfo,
                message: "Error adding product to cart",
                ccode: EErrors.CART_MISSING_FIELDS
            });
        }

        await cartRepository.addProduct(cartId, productId, quantity);
        console.log("Product added successfully to cart.");
        const cartID = (req.user.cart).toString();
        res.redirect(`/carts/${cartID}`);
    } catch (error) {
        console.error("Error caught in addProduct method:", error);
        next(error);
    }
}

    async deleteProduct(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const cart = await cartRepository.deleteProduct(cartId, productId);
            res.json({
                status: 'success',
                message: 'Product succesfully added to the cart!',
                cart,
            });
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateCart(req, res) {
        const cartId = req.params.cid;
        const newproducts = req.body;
        
        try {
            const newcart = await cartRepository.updateCart(cartId, newproducts);
            res.json(newcart);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const newcart = await cartRepository.updateQuantity(cartId, productId, newQuantity);

            res.json({
                status: 'success',
                message: 'Product quantity updated',
                newcart,
            });

        } catch (error) {
            res.status(500).send("Error updating quantity");
        }
    }

    async emptyCart(req, res) {
        const cartId = req.params.cid;
        try {
            const newcart = await cartRepository.emptyCart(cartId);

            res.json({
                status: 'success',
                message: 'Products eliminated successfully',
                newcart,
            });

        } catch (error) {
            res.status(500).send("Error");
        }
    }

   
    

    async checkout(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.getCartProducts(cartId);
            const products = cart.products;
    
            const unavailableProductIds = [];
            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.getProductById(productId);
                if (!product) {
                    throw new Error(`Product not found: ${productId}`);
                }
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    unavailableProductIds.push(productId);
                }
            }
    
            const userWithCart = await UserModel.findOne({ cart: cartId });
            const totalAmount = calculateTotal(cart.products);
    
            const ticket = new TicketModel({
                code: generateCode(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: userWithCart._id
            });
            await ticket.save();
    
            cart.products = cart.products.filter(item => !unavailableProductIds.includes(item.product.toString()));
            await cart.save();
    
            res.status(200).json({ unavailableProductIds });
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    

}

module.exports = CartController;

