
const socket = io();

console.log("connected");

// Fetch user role and email from the HTML (ensure these elements exist in your HTML)
const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;

// Log the role and email to the console
console.log("Current user role:", role);
console.log("Current user email:", email);

socket.on("products", (data) => {
    console.log(data);
    printProducts(data);
});

// Function to render products on the client side
const printProducts = (products) => {
    try {
        const productContainer = document.getElementById("productContainer");
        productContainer.innerHTML = "";

        products.docs.forEach(item => {
            // Check if the user is an admin or if the product belongs to the premium user
            if (role === "admin" || (role === "premium" && item.owner === email)) {
                // Log the role and the owner of the current product
                console.log("Role:", role, "Owner:", item.owner);

                const card = document.createElement("div");
                card.classList.add("card");

                // Set the inner HTML of the card with product information
                card.innerHTML = ` 
                    <p>Product: ${item.title}</p>
                    <p>Price: ${item.price}</p>
                    <button>Delete</button>
                `;

                // Append the card to the product container
                productContainer.appendChild(card);

                // Add event listener to the delete button to delete the product
                card.querySelector("button").addEventListener("click", () => {
                    deleteProduct(item._id);
                });
            } else {
                // Log the reason why the product is not displayed
                console.log(`Product not displayed. Role: ${role}, Product owner: ${item.owner}`);
            }
        });
    } catch (error) {
        console.error("Error in printProducts:", error);
    }
}


const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
};

document.getElementById("send").addEventListener("click", () => {
    addProduct();
});

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner: role === "premium" ? email : "admin" // Set owner based on role
    };

    socket.emit("addProduct", product);
};

// Optionally, log a message to indicate that the file was loaded
console.log("realtime.js loaded.");
