const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendOTP = async(email, otp, subject) => {
    try {
        const info = await transport.sendMail({
            from: "SecureShare Team<nandanmagdum14@gmail.com>",
            to: email,
            subject: subject,
            text: otp
        }
        );
        return info.accepted.length === 1 ? "success" : "fail";
    } catch (error) {
        console.error(error.message);
        return "fail";
    }
}

// const sendNotification = async

module.exports = {
    sendOTP
}