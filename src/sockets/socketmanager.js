// const socket = require("socket.io");
// const ProductRepository = require("../repositories/product.repository.js");
// const productRepository = new ProductRepository(); 
// const MessageModel = require("../models/message.model.js");

// class SocketManager {
//     constructor(httpServer) {
//         this.io = socket(httpServer);
//         this.initSocketEvents();
//     }

   

//     async initSocketEvents() {
//         this.io.on("connection", async (socket) => {
//             console.log("a client connected");
    
//             // Log the products being emitted to the client
//             console.log("Products being sent to client:", await productRepository.getProducts());
    
//             socket.emit("products", await productRepository.getProducts());
    
//             socket.on("deleteProduct", async (id) => {
//                 await productRepository.deleteProduct(id);
//                 this.emitUpdatedProducts(socket);
//             });
    
//             socket.on("addProduct", async (product) => {
//                 await productRepository.addProduct(product);
//                 console.log("Products after adding:", await productRepository.getProducts());
//                 this.emitUpdatedProducts(socket);
//             });
    
//             socket.on("message", async (data) => {
//                 await MessageModel.create(data);
//                 const messages = await MessageModel.find();
//                 socket.emit("message", messages);
//             });
//         });
//     }

//     async emitUpdatedProducts(socket) {
//         socket.emit("products", await productRepository.getProducts());
//     }
    
// }

// module.exports = SocketManager;


const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const MessageModel = require("../models/message.model.js");

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("A client connected");

            // Emit the current products to the newly connected client
            const products = await productRepository.getProducts();
            console.log("Products being sent to client on connection:", products);
            socket.emit("products", products);

            socket.on("deleteProduct", async (id) => {
                await productRepository.deleteProduct(id);
                this.emitUpdatedProducts();
            });

            socket.on("addProduct", async (product) => {
                await productRepository.addProduct(product);
                console.log("Products after adding:", await productRepository.getProducts());
                this.emitUpdatedProducts();
            });

            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
        });
    }

    async emitUpdatedProducts() {
        const products = await productRepository.getProducts();
        console.log("Updated products being sent to all clients:", products);
        this.io.emit("products", products); // Emit to all connected clients
    }
}

module.exports = SocketManager;