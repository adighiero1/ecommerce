const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository(); 
const MessageModel = require("../models/message.model.js");

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    // async initSocketEvents() {
    //     this.io.on("connection", async (socket) => {
    //         console.log("a client connected");
            
    //         socket.emit("products", await productRepository.getProducts() );
    //         console.log(await productRepository.getProducts());

    //         socket.on("deleteProduct", async (id) => {
    //             await productRepository.deleteProduct(id);
    //             this.emitUpdatedProducts(socket);
    //         });

    //         socket.on("addProduct", async (product) => {
    //             await productRepository.addProduct(product);
    //             console.log(await productRepository.getProducts());
    //             this.emitUpdatedProducts(socket);
    //         });

    //         socket.on("message", async (data) => {
    //             await MessageModel.create(data);
    //             const messages = await MessageModel.find();
    //             socket.emit("message", messages);
    //         });
    //     });
    // }

    // async emitUpdatedProducts(socket) {
    //     socket.emit("products", await productRepository.getProducts());
    // }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("a client connected");
    
            // Log the products being emitted to the client
            console.log("Products being sent to client:", await productRepository.getProducts());
    
            socket.emit("products", await productRepository.getProducts());
    
            socket.on("deleteProduct", async (id) => {
                await productRepository.deleteProduct(id);
                this.emitUpdatedProducts(socket);
            });
    
            socket.on("addProduct", async (product) => {
                await productRepository.addProduct(product);
                console.log("Products after adding:", await productRepository.getProducts());
                this.emitUpdatedProducts(socket);
            });
    
            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
        });
    }
    
}

module.exports = SocketManager;
