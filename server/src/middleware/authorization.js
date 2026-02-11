const authorization = (roles) => {
    return (req, res, next) => {
        
        // ensure user exists and role is authorized
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied! Authorized roles: ${roles}` 
            });
        }
        
        // move to next middleware
        next();
    };
};

module.exports = authorization;