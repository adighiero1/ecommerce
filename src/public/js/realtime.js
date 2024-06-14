// const socket = io();


// console.log("connected");



// // Listen for the "products" event from the server and call printProducts with the received data
// socket.on("products", (data) => {
//     console.log(data)
//     printProducts(data);
// });

// // Function to render products on the client side
// const printProducts = (products) => {
//     const productContainer = document.getElementById("productContainer");
//     productContainer.innerHTML = "";

   
//     products.docs.forEach(item => {
//         const card = document.createElement("div");
//         card.classList.add("card");

//         // Set the inner HTML of the card with product information
//         card.innerHTML = ` 
//             <p> Product: ${item.title} </p>
//             <p> Price: ${item.price} </p>
//             <button> Delete </button>
//         `;

//         // Append the card to the product container
//         productContainer.appendChild(card);

//         // Add event listener to the delete button to delete the product
//         card.querySelector("button").addEventListener("click", () => {
//             deleteProduct(item._id);
//         })
//     })
// }

// const deleteProduct = async (id) => {//not the same
//     socket.emit("deleteProduct", id);
        
// };

// document.getElementById("send").addEventListener("click", () => {
//     addProduct();
// })

// const addProduct = () => {
//     const product = {
//         title: document.getElementById("title").value,
//         description: document.getElementById("description").value,
//         price: document.getElementById("price").value, 
//         code: document.getElementById("code").value,
//         stock: document.getElementById("stock").value,
//         category: document.getElementById("category").value,
//         status: document.getElementById("status").value === "true",
//     };

// socket.emit("addProduct",product);
// };

// // Function to delete a product




// // Optionally, log a message to indicate that the file was loaded
// console.log("realtime.js loaded.");

///////////////////original///////////


// document.addEventListener("DOMContentLoaded", () => {
//     const socket = io();
//     console.log("connected");

//     const roleElement = document.getElementById("role");
//     const emailElement = document.getElementById("email");

//     if (!roleElement || !emailElement) {
//         console.error("Role or email element not found in the DOM");
//         return;
//     }

//     const role = roleElement.textContent;
//     const email = emailElement.textContent;

//     socket.on("products", (data) => {
//         console.log(data);
//         printProducts(data);
//     });

//     const printProducts = (products) => {
//         const productContainer = document.getElementById("productContainer");
//         productContainer.innerHTML = "";

//         products.docs.forEach(item => {
//             if (role === "premium" && item.owner !== email) {
//                 return;
//             }

//             const card = document.createElement("div");
//             card.classList.add("card");

//             card.innerHTML = ` 
//                 <p> Product: ${item.title} </p>
//                 <p> Price: ${item.price} </p>
//                 <button> Delete </button>
//             `;

//             productContainer.appendChild(card);

//             card.querySelector("button").addEventListener("click", () => {
//                 if (role === "admin" || (role === "premium" && item.owner === email)) {
//                     deleteProduct(item._id);
//                 } else {
//                     Swal.fire({
//                         title: "Error",
//                         text: "You do not have permission to delete this product",
//                     });
//                 }
//             });
//         });
//     };

//     const deleteProduct = async (id) => {
//         socket.emit("deleteProduct", id);
//     };

//     document.getElementById("send").addEventListener("click", () => {
//         addProduct();
//     });

//     const addProduct = () => {
//         const product = {
//             title: document.getElementById("title").value,
//             description: document.getElementById("description").value,
//             price: document.getElementById("price").value,
//             code: document.getElementById("code").value,
//             stock: document.getElementById("stock").value,
//             category: document.getElementById("category").value,
//             status: document.getElementById("status").value === "true",
//             owner: role === "premium" ? email : "admin",
//         };

//         socket.emit("addProduct", product);
//     };

//     console.log("realtime.js loaded.");
// });



// const socket = io();

// console.log("connected");

// // Fetch user role and email from the HTML
// const roleElement = document.getElementById("role");
// const emailElement = document.getElementById("email");

// if (roleElement && emailElement) {
//     const role = roleElement.textContent.trim();
//     const email = emailElement.textContent.trim();

//     console.log("User Role:", role);
//     console.log("User Email:", email);

//     socket.on("products", (data) => {
//         console.log("Received products data:", data);
//         printProducts(data);
//     });

//     // Function to render products on the client side
//     const printProducts = (products) => {
//         try {
//             const productContainer = document.getElementById("productContainer");
//             if (!productContainer) {
//                 console.error("Product container element not found");
//                 return;
//             }

//             productContainer.innerHTML = "";

//             products.docs.forEach(item => {
//                 console.log(`Processing product: ${item.title}, owner: ${item.owner}`);
//                 // Check if the user is an admin or if the product belongs to the premium user
//                 if (role === "admin" || (role === "premium" && item.owner === email)) {
//                     const card = document.createElement("div");
//                     card.classList.add("card");

//                     // Set the inner HTML of the card with product information
//                     card.innerHTML = ` 
//                         <p>Product: ${item.title}</p>
//                         <p>Price: ${item.price}</p>
//                         <button>Delete</button>
//                     `;

//                     // Append the card to the product container
//                     productContainer.appendChild(card);

//                     // Add event listener to the delete button to delete the product
//                     card.querySelector("button").addEventListener("click", () => {
//                         deleteProduct(item._id);
//                     });
//                 } else {
//                     console.log(`Skipping product: ${item.title}, owner: ${item.owner}`);
//                 }
//             });
//         } catch (error) {
//             console.error("Error in printProducts:", error);
//         }
//     }

//     const deleteProduct = (id) => {
//         socket.emit("deleteProduct", id);
//     };

//     document.getElementById("send").addEventListener("click", () => {
//         addProduct();
//     });

//     const addProduct = () => {
//         const product = {
//             title: document.getElementById("title").value,
//             description: document.getElementById("description").value,
//             price: document.getElementById("price").value,
//             code: document.getElementById("code").value,
//             stock: document.getElementById("stock").value,
//             category: document.getElementById("category").value,
//             status: document.getElementById("status").value === "true",
//             owner: role === "premium" ? email : "admin" // Set owner based on role
//         };

//         console.log("Adding product:", product);
//         socket.emit("addProduct", product);
//     };

//     console.log("realtime.js loaded.");
// } else {
//     console.error("Role or email elements are missing from the HTML");
// }


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
