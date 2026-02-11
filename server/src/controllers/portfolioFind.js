const User = require('../models/userSchema');

const getDetails = async (req, res) => {
  try {
    //verify the user's id matches with token
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Access denied! You can't access another user's portfolio" });
    }

    // find query
    const userData = await User.findOne({ st_id: req.params.id });

    //check for if user is found or not
    if (!userData) {
        return res.status(404).json({ message: "User data not found" });
    }

    //return user details
    return res.status(200).json({ message: "User details found", data: userData });
  } 
  
  //catch if any error occurred
  catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = { getDetails };