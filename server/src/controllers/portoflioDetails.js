const User = require('../models/userSchema')

const portfolioDetails = async (req, res) => {
  try {
    //check for id
    if(! req.body.id){
        return res.status(400).json({message : "No student id found"})
    }
    //find the specific user
    const userData = await User.findOne({st_id : req.body.id});

    //verify if user is found are not
    if(!userData){
        return res.status(404).json({message :  "Student data not found"});
    }

    // return users details if found
    return res.status(200).json({message : "Student details found" , data : userData});
  } 
  // catch if any error occured
  catch (err) {

    return res.status(500).json({message : "Internal server error" , error : err.message});
  }
};

module.exports = {portfolioDetails};
