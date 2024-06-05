const express = require("express");
const router = express.Router();
const makeProducts=require("../utils/faker.js");

router.get("/mockingproducts",(req,res)=>{
    const products=[];
    
    for (let i=0; i<100; i++){
        products.push(makeProducts());
    }
    res.json(products);
})

module.exports=router;

