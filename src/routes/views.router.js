// const express = require("express");
// const router = express.Router();
// const ViewsController = require("../controllers/view.controller.js");
// const viewsController = new ViewsController();
// const checkUserRole = require("../middleware/checkrole.js");
// const addLogger = require("../utils/logger.js");
// const passport = require("passport");
// router.use(addLogger);
// router.get("/carts/:cid", viewsController.getCart);
// router.get("/login", viewsController.getLogin);
// router.get("/register", viewsController.getRegister);
// router.get("/products", checkUserRole(['user']),passport.authenticate('jwt', { session: false }), viewsController.getProducts);
// router.get("/realtimeproducts", checkUserRole(['admin']), viewsController.getRealtimeProducts);
// router.get("/chat", checkUserRole(['user']) ,viewsController.getChat);
// router.get("/", viewsController.getHome);
// router.get("/loggerTest",(req,res)=>{
//     req.logger.debug('This is a debug message');
//     req.logger.http('This is an http message');
//     req.logger.info('This is an info message');
//     req.logger.warning('This is a warning message');
//     req.logger.error('This is an error message');
//     req.logger.fatal('This is a fatal message');
//     res.send('Check the logs to see the output!');
// });

// router.get("/loggerTest2", (req, res) => {
//     const logger = req.logger;
//     if (mode === "produccion") {
//         logger.info('This is an info message');
//         logger.warning('This is a warning message');
//         logger.error('This is an error message');
//         logger.fatal('This is a fatal message');
//     } else {
//         logger.debug('This is a debug message');
//         logger.http('This is an http message');
//         logger.info('This is an info message');
//         logger.warning('This is a warning message');
//         logger.error('This is an error message');
//         logger.fatal('This is a fatal message');
//     }
//     res.send('Check the logs to see the output!');
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");
const SwaggerConfig = require("../controllers/swagger.controller.js");
const swaggerConfig = new SwaggerConfig();
swaggerConfig.setup(router);
module.exports = (mode) => {
    router.get("/carts/:cid", viewsController.getCart);
    router.get("/login", viewsController.getLogin);
    router.get("/register", viewsController.getRegister);
    router.get("/products", checkUserRole(['user','premium']), passport.authenticate('jwt', { session: false }), viewsController.getProducts);
    router.get("/realtimeproducts", checkUserRole(['admin','premium']), viewsController.getRealtimeProducts);
    router.get("/chat", checkUserRole(['user']), viewsController.getChat);
    router.get("/", viewsController.getHome);


    router.get("/passwordreset",viewsController.getPasswordReset);
    router.get("/emailconfirmation",viewsController.getEmailConfirmation);
    router.get("/passwordchange",viewsController.getPasswordChange);
    router.get("/rolechange",viewsController.getChangeRole);

    router.get("/loggerTest", (req, res) => {
        const logger = req.logger;
        if (mode === "produccion") {
            logger.info('This is an info message');
            logger.warning('This is a warning message');
            logger.error('This is an error message');
            logger.fatal('This is a fatal message');
        } else {
            logger.debug('This is a debug message');
            logger.http('This is an http message');
            logger.info('This is an info message');
            logger.warning('This is a warning message');
            logger.error('This is an error message');
            logger.fatal('This is a fatal message');
        }
        res.send('Check the logs to see the output!');
    });
    
    return router;
};
