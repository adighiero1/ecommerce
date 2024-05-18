
const generateCode = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 8); // Using 8 characters for randomness
    return timestamp + '-' + random;
}


const calculateTotal = (products) => {
    let total = 0;

    products.forEach(item => {
        total += item.product.price * item.quantity;
    });

    return total;
}

module.exports = {
    generateCode,
    calculateTotal
}