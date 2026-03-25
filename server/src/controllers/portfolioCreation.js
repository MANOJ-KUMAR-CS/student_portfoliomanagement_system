const User = require("../models/userSchema");

const createPortfolio = async (req, res) => {
  try {

    // User id validation
    if (req.user.id !== req.body.st_id) {
      return res.status(403).json({ message: "Access denied you can't access others portfolio" });
    }

    // check for data
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data provided!" });
    }

    //create a user object
    const studentDetails = new User(req.body);

    // add user to database
    const saveUser = await studentDetails.save();

    // return user details and message
    return res.status(200).json({
      message: "Portfolio created successfully",
      data: saveUser,
    });
  } 

  catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: "Validation Failed: " + messages.join(', ') });
    }
    return res.status(500).json({
        message: "Internal Server Error",
        error: err.message
    });
  }
};

module.exports = { createPortfolio };