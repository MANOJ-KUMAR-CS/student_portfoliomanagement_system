const bcrypt = require('bcrypt');

const securePassword = async (password) => {
    try {
        // generate salt with 10 rounds
        const salt = await bcrypt.genSalt(10);

        // hash the password using the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch (error) {
        // handle potential hashing errors
        console.error("Error hashing password:", error);
        throw new Error("Password securement failed");
    }
}

module.exports = { securePassword };