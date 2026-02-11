const isValidEmail = require("../validator/emailValidator");
const db = require("../config/mySqlDb");
const bcrypt = require("bcrypt");
const generateToken = require("../jwt/generateToken");

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ message: "Email or OTP missing", verified: false });
  }

  //Verify email is valid or not
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format!" });
  }

  const query = "SELECT otp_hash, otp_expiry FROM users WHERE email = ?";

  //Query execution
  db.query(query, [email], async (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database error", verified: false });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found", verified: false });
    }

    //Match the names from the SELECT query
    const { otp_hash, otp_expiry } = result[0];

    //Check Expiry
    if (new Date() > new Date(otp_expiry)) {
      return res.status(403).json({ message: "Otp expired", verified: false });
    }

    try {
      //Compare hashed OTP and OTP from user
      const isMatch = await bcrypt.compare(otp, otp_hash);

      if (!isMatch) {
        return res
          .status(403)
          .json({ message: "Invalid otp", verified: false });
      }

      // Inside your success block in verifyOtp
      const clearOtpQuery =
        "UPDATE users SET otp_hash = NULL, otp_expiry = NULL WHERE email = ?";
      db.query(clearOtpQuery, [email], (err) => {
        if (err){
            console.log("Failed to clear OTP");
        }
        
        const userData = {
          email : email,
          verified : true
        }

        const token = generateToken(userData , '10m');
        
        // verify if token is generated 
        if (!token) {
          return res.status(400).json({ message: "Can't Generate Token" });
        }

        return res
          .status(200)
          .json({ message: "Otp verified successfully", verified: true , token : token});
      });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Internal server error during verification",
          verified: false,
        });
    }
  });
};

module.exports = {verifyOtp};
