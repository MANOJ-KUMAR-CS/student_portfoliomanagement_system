const jwt = require('jsonwebtoken');


const generateToken = ( payload )=>{
    const securityKey = process.env.SECURITYKEY;

    const token = jwt.sign(payload , securityKey , { expiresIn: '2d' });

    return token;
}

module.exports = generateToken;