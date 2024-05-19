const CartModel = require("../models/cart.model.js");

class CartRepository {
    async createCart() { 
        try {
            const newcart = new CartModel({ products: [] });
            await newcart.save();
            return newcart;
        } catch (error) {
            throw new Error("Error crerating cart");
        }
    }

    async getCartProducts(cartid) { 
        try {
            const cart = await CartModel.findById(cartid);
            if (!cart) {
                console.log("no cart exits with this id");
                return null;
            }
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }
    async deleteProduct(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Cart was not found');
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async addProduct(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartProducts(cartId);
            const prodcutexits = cart.products.find(item => item.product._id.toString() === productId);

            if (prodcutexits) {
                prodcutexits.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            
            cart.markModified("products");

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }



    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart was not found');
            }

            cart.products = updatedProducts;

            cart.markModified('products');
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async updateQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                
                throw new Error('Cart not found');
            }
            
            
            const productIndex = cart.products.findIndex(item => item._id.toString() === productId);
        
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;


                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Product was not found');
            }

        } catch (error) {
            throw new Error("Error");
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('The cart was not found');
            }

            return cart;

        } catch (error) {
            throw new Error("Error");
        }
    }
}

module.exports = CartRepository;



