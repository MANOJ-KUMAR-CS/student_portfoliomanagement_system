const db = require("../config/mySqlDb");
const bcrypt = require("bcrypt");
const generateToken = require("../jwt/generateToken");
const isValidEmail = require("../../validator/emailValidator");

const userLogin = (req, res) => {
  const { email, password } = req.body;

  const constraints = {
    email: "Email is missing",
    password: "Password is missing",
  };

  //Checking whether all constraints available
  for (let key in constraints) {
    if (!req.body[key]) {
      return res.status(400).json({ message: constraints[key] });
    }
  }

  //Verify email is valid or not
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format!" });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  //Query execution
  db.query(query, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error occurred in Database" });
    }

    //verify if there is no such user
    if (result.length == 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    try {
      //compare hashed password and password from user
      const passwordCheck = await bcrypt.compare(password, user.password);

      if (!passwordCheck) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const userdata = {
        id: user.id,
        name: user.userName,
        role: user.role,
      };

      //Generate Token
      const token = generateToken(userdata , '2d');

      // verify if token is generated 
      if (!token) {
        return res.status(400).json({ message: "Can't Generate Token" });
      }

      //return user details 
      return res.status(200).json({
        message: "Login successfully",
        userdata: userdata,
        token: token
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error during authentication" });
    }
  });
};

module.exports = { userLogin };