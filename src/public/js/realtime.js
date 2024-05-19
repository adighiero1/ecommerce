const socket = io();


console.log("connected");



// Listen for the "products" event from the server and call printProducts with the received data
socket.on("products", (data) => {
    console.log(data)
    printProducts(data);
});

// Function to render products on the client side
const printProducts = (products) => {
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";

   
    products.docs.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        // Set the inner HTML of the card with product information
        card.innerHTML = ` 
            <p> Product: ${item.title} </p>
            <p> Price: ${item.price} </p>
            <button> Delete </button>
        `;

        // Append the card to the product container
        productContainer.appendChild(card);

        // Add event listener to the delete button to delete the product
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item._id);
        })
    })
}

const deleteProduct = async (id) => {//not the same
    try {
        // Delete the product using the ProductService
        await productService.deleteProduct(id);
        // Emit a "deleteProduct" event with the product ID to delete
        socket.emit("deleteProduct", id);
    } catch (error) {
        console.error("Error deleting product:", error);
    }
};

document.getElementById("send").addEventListener("click", () => {
    addProduct();
})

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value, 
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    };

socket.emit("addProduct",product);
};

// Function to delete a product




// Optionally, log a message to indicate that the file was loaded
console.log("realtime.js loaded.");


