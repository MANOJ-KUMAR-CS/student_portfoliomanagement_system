const jwt = require('jsonwebtoken');


const verifyToken = (req , res , next)=>{

    const authHeader =  req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({message : "Access Denied"});
    }

    try{
        const securityKey = process.env.SECURITYKEY;
        const verified = jwt.verify(token , securityKey);
        req.user = verified;
        next();
    }
    catch(err){
        return res.status(403).json({message : "Invalid Token"});
    }

}

module.exports = verifyToken;