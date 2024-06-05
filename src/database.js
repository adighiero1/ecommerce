// const mongoose = require("mongoose");

// mongoose.connect("mongodb+srv://dighieroalejandro:Cure707buy!@codercluster.jnomixr.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=CoderCluster")
//     .then(() => console.log("Successfully connected to database"))
//     .catch(() => console.log("Error connecting to the server"));



// Importing the required modules using CommonJS
const mongoose = require("mongoose");
const configObject = require("./config/config");

// Destructuring the config object to get mongo_url and puerto
const { mongo_url, puerto } = configObject;

// Connecting to the MongoDB database using mongoose
mongoose.connect(mongo_url)
  .then(() => console.log("Successfully connected to database"))
  .catch(() => console.log("Error connecting to the server"));

// const mongoose = require("mongoose");

// mongoose.connect("mongodb+srv://dighieroalejandro:Cure707buy!@codercluster.jnomixr.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=CoderCluster")
//     .then(() => console.log("Successfully connected to database"))
//     .catch(() => console.log("Error connecting to the server"));
