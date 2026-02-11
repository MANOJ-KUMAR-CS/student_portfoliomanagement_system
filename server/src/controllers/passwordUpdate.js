const db = require('../config/mySqlDb');
const isValidEmail = require("../../validator/emailValidator");
const { securePassword } = require('../middleware/hasing');

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format!" });
  }

  if (newPassword.length < 4) {
    return res.status(400).json({ message: "Password must be at least 4 characters long" });
  }

  try {
  
      // 2. Hash the new password
      const hashedPassword = await securePassword(newPassword);

      // 3. Update password AND reset is_verified back to 0
      const updateQuery = "UPDATE users SET password = ? WHERE email = ?";

      db.query(updateQuery, [hashedPassword, email], (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating password" });

        return res.status(200).json({
          message: "Password has been reset successfully!",
          success: true,
        });
      });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {resetPassword};