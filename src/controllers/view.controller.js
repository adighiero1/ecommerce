const ProductModel = require("../models/product.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();

class ViewsController {


    async getProducts(req, res) {
        try {
            const { page = 1, limit = 6 } = req.query;
            const skip = (page - 1) * limit;

            const products = await ProductModel.aggregate([
                { $skip: skip },
                { $limit: parseInt(limit) },
                { $addFields: { id: { $toString: "$_id" } } },
                { $project: { _id: 0, id: 1, title: 1, description: 1, price: 1, img: 1 } } // Explicitly project required fields
            ]);

            console.log("Fetched products:", products);

            const totalProducts = await ProductModel.countDocuments();
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

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
            console.error("Error fetching products", error);
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
                console.log("Cart does not exist");
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
            console.error("Error getting the cart", error);
            res.status(500).json({ error: "Server Error" });
        }
    }


    async getLogin(req, res) {
        res.render("login");
    }

    async getRegister(req, res) {
        res.render("register");
    }

    async getRealtimeProducts(req, res) {
        try {
            res.render("realtimeproducts");
        } catch (error) {
            console.log("Error", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getChat(req, res) {
        res.render("chat");
    }

    async getHome(req, res) {
        res.render("home");
    }
}

module.exports = ViewsController;
