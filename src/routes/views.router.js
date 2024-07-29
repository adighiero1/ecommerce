const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");
const SwaggerConfig = require("../controllers/swagger.controller.js");
const swaggerConfig = new SwaggerConfig();
const TicketModel= require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
swaggerConfig.setup(router);
module.exports = (mode) => {
    router.get("/carts/:cid", viewsController.getCart);
    router.get("/login", viewsController.getLogin);
    router.get("/register", viewsController.getRegister);
    router.get("/products", checkUserRole(['user','premium']), passport.authenticate('jwt', { session: false }), viewsController.getProducts);
    router.get("/realtimeproducts", checkUserRole(['admin','premium']), viewsController.getRealtimeProducts);
    router.get("/chat", checkUserRole(['user']), viewsController.getChat);
    router.get("/", viewsController.getHome);

    router.get("/documents",passport.authenticate("jwt", { session: false }),viewsController.getDocuments);
    router.get("/passwordreset",viewsController.getPasswordReset);
    router.get("/emailconfirmation",viewsController.getEmailConfirmation);
    router.get("/passwordchange",viewsController.getPasswordChange);
    router.get("/rolechange",viewsController.getChangeRole);


    router.get('/checkout/:code', async (req, res) => {
        const ticketCode = req.params.code;
    
        try {
            // Find the ticket with the given code
            const ticket = await TicketModel.findOne({ code: ticketCode }).lean();
            if (!ticket) {
                console.log('Ticket not found');
                return res.status(404).json({ error: 'Ticket not found' }); 
            }
    
            res.render('checkout', { ticket });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });


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
