const db = require('../config/mySqlDb');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail  = require('../services/sendEmail');
const isValidEmail = require('../validator/emailValidator');

const generateOtp = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Please Enter email" });
    }

    //Verify email is valid or not
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format!" });
    }

    // 1. First, check if user exists
    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: `Error occurred: ${err.message}` });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Email is not registered" });
        }

        try {
            // 2. Generate and Hash OTP
            const otp = crypto.randomInt(100000, 999999).toString();
            const saltRound = 10;
            const hashedOtp = await bcrypt.hash(otp, saltRound);
            const expiry = new Date(Date.now() + 5 * 60000);

            // 3. Update the database
            const query1 = "UPDATE users SET otp_hash = ?, otp_expiry = ? WHERE email = ?";

            db.query(query1, [hashedOtp, expiry, email], async (err, updateResult) => {
                if (err) {
                    return res.status(500).json({ message: `Update error: ${err.message}` });
                }

                if (updateResult.affectedRows === 0) {
                    return res.status(403).json({ message: "Unable to store OTP" });
                }

                try {
                    // 4. Send the email
                    await sendEmail(email, otp);
                    return res.status(200).json({ message: "Otp is sent to your mail" });
                } catch (emailErr) {
                    return res.status(500).json({ message: `Failed to  email ${emailErr}` });
                }
            });
        } catch (hashErr) {
            return res.status(500).json({ message: "Error generating secure OTP" });
        }
    });
};

module.exports ={ generateOtp};