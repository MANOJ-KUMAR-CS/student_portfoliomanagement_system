const nodemailer = require('nodemailer');
require('dotenv').config();
const sendEmail = async (email, otp) => {
    try {

        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOption = {
            from: process.env.EMAIL,
            to: email,
            subject: "OTP Verification",
            text: `Your OTP is ${otp}. It expires in 5 minutes.`
        };

        const info = await transporter.sendMail(mailOption);
        return info;
    } catch (error) {
        console.error("Email error: ", error);
        throw error;
    }
}

module.exports = sendEmail;