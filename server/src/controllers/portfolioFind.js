const User = require('../models/userSchema')

const getDetails = async (req, res) => {
  try {
    if (req.user.id != req.params.id ) {
      return res
        .status(403)
        .json({ message: "Access denied! You can't access another user's portfolio" });
    }

    const userData = await User.findOne({st_id : req.params.id});

    if(!userData){
        return res.status(404).json({message :  "User data not found"});
    }

    return res.status(200).json({message : "User details found" , data : userData});
  } 
  catch (err) {

    return res.status(500).json({message : "Internal server error" , error : err.message});
  }
};

module.exports = {getDetails};
