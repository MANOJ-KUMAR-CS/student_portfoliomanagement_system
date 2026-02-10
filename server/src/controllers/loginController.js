const db = require("../config/mySqlDb");
const bcrypt = require("bcrypt");
const generateToken = require("../jwt/generateToken");

const userLogin = (req, res) => {
  const { email, password } = req.body;

  const constriants = {
    email: "Email is missing",
    password: "Password is missing",
  };

  //Checking weather all consttriants avalible
  for (let key in constriants) {
    if (!req.body[key]) {
      return res.status(400).json({ message: constriants[key] });
    }
  }

  //Verify email is valid or not
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email formate" });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  //Query execution
  db.query(query, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error occured in DataBase" });
    }

    //verify if there is no such user
    if (result.length == 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    //compare hashed password and password from user
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const userdata = {
        id: user.id,
        name: user.userName,
        role: user.role,
    }

    //Generate Token
    const token = generateToken(userdata);

    // verify if token is generated 
    if(!token){
      return res.status(400).json({message : "Can't Generate Token"});
    }
    
    //return user details 
    return res.status(200).json({
      message: "Login successfully", userdata :userdata , token
    });
  });
};

module.exports = { userLogin };
