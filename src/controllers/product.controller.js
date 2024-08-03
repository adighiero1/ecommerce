const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const Email= require("../utils/email.js");
const emailService = new Email();
class ProductController {

    async addProduct(req, res) {
        const newproduct = req.body;
        try {
            const product = await productRepository.addProduct(newproduct);
            res.json(product);

        } catch (error) {
            res.status(500).send("Error");
        }
    }



    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;

            const products = await productRepository.getProducts(limit, page, sort, query);
            console.log(products);
            res.json(products);
        } catch (error) { 
            res.status(500).send("Error");
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const productid = await productRepository.getProductById(id);
            if (!productid) {
                return res.json({
                    error: "Product was not found"
                });
            }
            res.json(productid);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productoupdate = req.body;

            const product = await productRepository.updateProduct(id, productoupdate);
            res.json(product);
        } catch (error) {
            res.status(500).send("Error updating product");
        }
    }

    async deleteProduct(req, res) {
        console.log("hello this is triggered");
        const id = req.params.pid;
        try {
            let producttodelete = await productRepository.deleteProduct(id);
            
            await emailService.productDeleted(producttodelete.owner, producttodelete.title);
            res.json(producttodelete);
        } catch (error) {
            res.status(500).send("Error deleting product");
        }
    }

    // async searchProducts  (req, res) {
    //     try {
    //         const query = req.query.query; // Get the search query from the URL
    //         const products = await productRepository.searchProducts(query);
    
    //         res.render('searchresults', {products, query }); //pass the query to view
    //     } catch (error) {
    //         console.error('Error searching products:', error);
    //         res.status(500).send('Internal Server Error');
    //     }
    // };
    // async searchProducts(req, res) {
    //     try {
    //         const query = req.query.query;
    //         console.log('Search query:', query);
    //         const products = await productRepository.searchProducts(query);
    //         console.log('Search results:', products);
    
    //         res.render('searchresults', { products, query });
    //     } catch (error) {
    //         console.error('Error searching products:', error);
    //         res.status(500).send('Internal Server Error');
    //     }
    // }

//     async searchProducts(req, res) {
//     // try {
//     //     const query = req.query.query;
//     //     console.log('Search query:', query);
//     //     const products = await productRepository.searchProducts(query);
//     //     console.log('Search results:', products);
//     //     res.render('searchresults', { products, query });
//     // } catch (error) {
//     //     console.error('Error searching products:', error);
//     //     res.status(500).send('Internal Server Error');
//     // }
//     res.render("searchresults");
// }

async searchProducts(req, res) {
    try {
        console.log('Rendering search results view'); // Add this log to confirm the method is hit
        res.render('searchresults'); // Render the view
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).send('Internal Server Error');
    }
}

async renderDiv(req, res) {
    try {
        console.log('renderDiv method called');
        res.send('<div>Hello, this is a test div!</div>');
    } catch (error) {
        console.error('Error rendering div:', error);
        res.status(500).send('Error rendering div');
    }
}


}

module.exports = ProductController; 