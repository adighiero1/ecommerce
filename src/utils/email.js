const nodemailer = require('nodemailer');

class Email{
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: "adighiero1@gmail.com",
                pass: "laxe qbbn jjfe qpcg"
            }
        });
    }

    async resetPassword(email,first_name,last_name,token){
        try{
        const emailInfo ={
            from: "adighiero1@gmail.com",
            to:email,
            subject:"password reset",
            html:`
            <h3>Password reset</h3>
            <p>Hello ${first_name} ${last_name}</p>
            <p>You have requested a password reset</p>
            <p>Please use the code below to reset your password</p>
            <h2>${token}<h2>
            <a href="https://ecommerce-production-46f3.up.railway.app//passwordchange">Reset Password</a>
            <p>If this was not you please ignore thi email`
        }
        await this.transporter.sendMail(emailInfo);
        }catch(error){
            console.log("error sending email",error);
            throw error("error sending email");
        }
    }

    async sendTicket(email, first_name, last_name, ticket) {
        try {
            const emailInfo = {
                from: "adighiero1@gmail.com",
                to: email,
                subject: "Your Purchase Ticket",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                        <h3 style="color: #4CAF50; text-align: center;">Your Purchase Ticket</h3>
                        <p style="color: #333; font-size: 1.1em;">Hello <span style="font-weight: bold;">${first_name} ${last_name}</span>,</p>
                        <p style="color: #333; font-size: 1em; line-height: 1.5;">Thank you for your purchase! Here are your ticket details:</p>
                        <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0;">
                            <p style="color: #333; font-size: 1.1em;"><strong>Order Code:</strong> ${ticket.code}</p>
                            <p style="color: #333; font-size: 1.1em;"><strong>Purchase Date:</strong> ${ticket.purchase_datetime}</p>
                            <p style="color: #333; font-size: 1.1em;"><strong>Total Amount:</strong> $${ticket.amount}</p>
                        </div>
                        <p style="color: #333; font-size: 1em; line-height: 1.5;">If you have any questions, please contact our support team.</p>
                        <p style="color: #333; font-size: 1em; line-height: 1.5;">Kind Regards,</p>
                        <p style="color: #333; font-size: 1em; line-height: 1.5;">VapeLife</p>
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="http://localhost:8080/support" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Contact Support</a>
                        </div>
                    </div>`
            };
            await this.transporter.sendMail(emailInfo);
        } catch (error) {
            console.log("Error sending email", error);
            throw new Error("Error sending email");
        }
    }

    async sendAccountDeletionNotification(email, first_name, last_name) {
        try {
            const emailInfo = {
                from: "adighiero1@gmail.com",
                to: email,
                subject: "Account Deletion Notification",
                html: `

                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                        <h3 style="color: #4CAF50; text-align: center;">Your account has been deleted</h3>
                        <p style="color: #333; font-size: 1.1em;">Hello <span style="font-weight: bold;">${first_name} ${last_name}</span>,</p>
                        <p style="color: #333; font-size: 1em; line-height: 1.5;">Your account has been deleted due to inactivity. If you believe this is a mistake, please contact our support team.</p> 
                        <p style="color: #333; font-size: 1em; line-height: 1.5;">If you have any questions, please contact our support team.</p>
                        <p style="color: #333; font-size: 1em; line-height: 1.5;">Kind Regards,</p>
                        <p style="color: #333; font-size: 1em; line-height: 1.5;">VapeLife</p>
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="http://localhost:8080/support" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Contact Support</a>
                        </div>
                    </div>`

                   
                    
                
            };
            await this.transporter.sendMail(emailInfo);
        } catch (error) {
            console.log("Error sending email", error);
            throw new Error("Error sending email");
        }
    }

// async productDeleted(email,product){
//     try{
//         const emailInfo = {
//             from: "adighiero1@gmail.com",
//             to: email,
//             subject:"Product deleted",
//             html:`
//             <h3>Product deleted</h3>
//             <p>Hello!</p>
//             <p>Your product ${product} has been deleted by either you or an admin</p>
//             <p>Please review and update your product list</p>
//             <p> if you have any questions please contact us</p>
//             `
//         }
//         await this.transporter.sendMail(emailInfo);
//         }catch(error){
//             console.log("error sending email",error);
//             throw error("error sending email");
//         }
    
// }

async productDeleted(email, product) {
    try {
        const emailInfo = {
            from: "adighiero1@gmail.com",
            to: email,
            subject: "Product Deleted",
            html: `
                <h3>Product Deleted</h3>
                <p>Hello,</p>
                <p>Your product "${product}" has been deleted by either you or an admin.</p>
                <p>Please review and update your product list.</p>
                <p>If you have any questions, please contact us.</p>
            `
        };
        await this.transporter.sendMail(emailInfo);
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Error sending email:", error);
        throw new Error("Error sending email");
    }
}


}

module.exports = Email;