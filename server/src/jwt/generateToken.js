const jwt = require('jsonwebtoken');

const generateToken = (payload,expiryTime) => {
    const securityKey = process.env.SECURITYKEY;

    // verify if security key is available in environment variables
    if (!securityKey) {
        console.error("Missing SECURITYKEY in environment variables");
        return null;
    }

    // sign the token with payload and key
    const token = jwt.sign(payload, securityKey, { expiresIn: expiryTime  });

    return token;
}

module.exports = generateToken;