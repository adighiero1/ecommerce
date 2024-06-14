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
            <a href="http://localhost:8080/passwordchange">Reset Password</a>
            <p>If this was not you please ignore thi email`
        }
        await this.transporter.sendMail(emailInfo);
        }catch(error){
            console.log("error sending email",error);
            throw error("error sending email");
        }
    }
}

module.exports = Email;