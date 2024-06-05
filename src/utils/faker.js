const { faker } = require('@faker-js/faker');


const makeProducts=()=>{
return{
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: "awesome product",
    price: faker.commerce.price(),
    thumbnail: faker.image.imageUrl(),
    code: faker.datatype.uuid(),
    stock: faker.datatype.number(),
    category: faker.commerce.department(),
    status: faker.datatype.boolean(),
}
}

module.exports=makeProducts;