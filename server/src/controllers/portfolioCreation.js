const User = require("../models/userSchema");

const createPortfolio = async (req, res) => {
  try {

    // User id validation
    if(req.user.id != req.params.id || req.user.id !=req.body.st_id){
      return res.status(403).json({message : "Access denied you can't access others portfolio"});
    }

    // check for data
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data provided! " });
    }

    const studentDetails = new User(req.body);

    const saveUser = await studentDetails.save();

    return res.status(200).json({
      message: "Portfolio created successfully",
      data: saveUser,
    });
  } 
  
  catch (err) {
    return res.status(400).json({
        message : "Validation Error",
        error : err.message
    })
  }
};
module.exports = {createPortfolio};
