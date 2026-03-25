const User = require('../models/userSchema');

const portfolioDetails = async (req, res) => {
  try {
    //check for id
    if (!req.query.id) {
        return res.status(400).json({ message: "No student id provided" });
    }

    //find the specific user
    const userData = await User.findOne({ st_id: req.query.id });

    // 200 with null data is cleaner than a 404 for "no portfolio yet"
    return res.status(200).json({ 
        message: userData ? "Student details found" : "Student data not found", 
        data: userData || null 
    });
  } 
  
  // catch if any error occurred
  catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = { portfolioDetails };