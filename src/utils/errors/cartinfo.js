
const generateCartErrorInfo = (productId, quantity) => {
    return `The cart data is incomplete or invalid.
    We need the following data:
    - Product ID: ${productId ? productId : 'missing'}
    - Quantity: ${quantity ? quantity : 'missing'}
    `;
};


module.exports=generateCartErrorInfo;