const verifyResetToken = () => {
    return (req, res, next) => {
        // req.user is now available because verifyToken ran first! 
        if (!req.user || req.user.verified !== true) {
            return res.status(403).json({ 
                message: "Access denied: OTP verification required" 
            });
        }
        
        next();
    };
};

module.exports = verifyResetToken;