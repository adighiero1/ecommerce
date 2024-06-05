// const generateCartErrorInfo = (cart) => {
//     return `The cart data is incomplete or invalid.
//     We need the following data:
//     - Product ID: ${cart.productId ? cart.productId : 'missing'}
//     - Quantity: ${cart.quantity ? cart.quantity : 'missing'}
//     `;
// };

const generateCartErrorInfo = (productId, quantity) => {
    return `The cart data is incomplete or invalid.
    We need the following data:
    - Product ID: ${productId ? productId : 'missing'}
    - Quantity: ${quantity ? quantity : 'missing'}
    `;
};


module.exports=generateCartErrorInfo;