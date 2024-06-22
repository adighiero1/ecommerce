const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const path = require('path');
const dotenv = require("dotenv");
const configObject = require("./config/config.js");
// const {mongo_url, puerto} = configObject; 
const {mongo_url, puerto, mode} = configObject;  // Include mode here
const PORT = puerto;
require("./database.js");
const authMiddleware = require("./middleware/authmiddleware.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const mockingproducts= require("./routes/mockingproducts.js");
const errorHandler= require("./middleware/errorHandler.js");
const addLogger = require('./utils/logger.js');
const SwaggerConfig = require("./controllers/swagger.controller.js");
const swaggerConfig = new SwaggerConfig();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.use(passport.initialize());
initializePassport();
app.use(cookieParser());



app.use(authMiddleware);
app.use(addLogger);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");





app.use("/mockingproducts",mockingproducts);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
// app.use("/", viewsRouter);
app.use("/", viewsRouter(mode));
app.use("/api/products", productsRouter);

app.use(errorHandler);
swaggerConfig.setup(app);
const httpServer = app.listen(PORT, () => {
    console.log(`Server listening at Port: ${PORT}`);
});


const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);

