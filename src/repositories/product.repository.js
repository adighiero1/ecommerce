const ProductModel = require("../models/product.model.js");
const Email= require("../utils/email.js");
const emailService = new Email();
class ProductRepository {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails,owner }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Missing fields");
                return;
            }

            const existingProduct = await ProductModel.findOne({ code: code });

            if (existingProduct) {
                console.log("error with the code");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || [],
                owner
            });

            await newProduct.save();

            return newProduct;

        } catch (error) {
            throw new Error("Error addomg product!");
        }
    }

    async getProducts(limit = 10, page = 1, sort, query) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const products = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);
            
            const totalPages = Math.ceil(totalProducts / limit);
            
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            throw new Error("Error");
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);

            if (!product) {
                console.log("Product not found");
                return null;
            }

            console.log("Product found.");
            return product;
        } catch (error) {
            throw new Error("Error obtaining product by it's id.");
        }
    }

    async updateProduct(id, data) {
        try {
            const updatedproduct = await ProductModel.findByIdAndUpdate(id, data);
            if (!updatedproduct) {
                console.log("product not found.");
                return null;
            }

            console.log("Product updated successfully");
            return updatedproduct;
        } catch (error) {
            throw new Error("Error");
        }
    }

    // async deleteProduct(id) {
    //     try {
    //         const deletedproduct = await ProductModel.findByIdAndDelete(id);

    //         if (!deletedproduct) {
    //             console.log("The product was not found for deletion.");
    //             return null;
    //         }
    //         console.log("Product deleted.");
    //         return deletedproduct;
    //     } catch (error) {
    //         throw new Error("Error");
    //     }
    // }

    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);

            if (!deletedProduct) {
                console.log("The product was not found for deletion.");
                return null;
            }

            console.log("Product deleted.");

            // Send email notification
            if (deletedProduct.owner) {
                await emailService.productDeleted(deletedProduct.owner, deletedProduct.title);
            }

            return deletedProduct;
        } catch (error) {
            throw new Error("Error deleting product!");
        }
    }

    async searchProducts(query) {
        try {
            const products = await ProductModel.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            });
            return products;
        } catch (error) {
            throw new Error("Error searching products!");
        }
    }

}

module.exports = ProductRepository;