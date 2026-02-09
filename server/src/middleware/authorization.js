const authorization = (role) => {
    return (req , res , next) => {
        if(req.user.role !== role) {
            return res.status(401).json({message : `Access denied only ${role} can access`});
        };
        next();

    };
};

module.exports = authorization;