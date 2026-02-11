const isValidEmail = require("../../validator/emailValidator");
const db = require("../config/mySqlDb");
const { securePassword } = require("../middleware/hasing");

const userRegister = (req, res) => {

  const constraints = {
    userName: "Name is missing",
    email: "Email is missing",
    phoneNo: "Phone number is missing",
    role: "Role is missing",
    password: "Password is missing",
  };

  //check whether all constraints are available 
  for (let key in constraints) {
    if (!req.body[key]) {
      return res.status(400).json({ message: constraints[key] });
    }
  }

  //change name to lowercase
  req.body.userName = req.body.userName.toLowerCase();

  const { userName, email, phoneNo, role, password } = req.body;

  //Verify the given constraints are valid
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format!" });
  }

  if (role !== 'student' && role !== 'admin') {
    return res.status(400).json({ message: "Role should be either student or admin" });
  }

  // check if phone number is 10 digits and numeric
  if (phoneNo.length !== 10 || isNaN(phoneNo)) {
    return res.status(400).json({ message: "Phone Number must contain 10 digits" });
  }

  if (password.length < 4) {
    return res.status(400).json({ message: "Password must be at least 4 characters long" });
  }

  const query_1 = "SELECT * FROM users WHERE email = ?";

  //query execution for verify duplicate entry  
  db.query(query_1, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error occurred in Database" });
    }
    if (result.length > 0) {
      return res.status(400).json({ message: "Email id already exists" });
    }
    try {
      //hash password
      const hashedPassword = await securePassword(password);

      const query =
        "INSERT INTO users (userName, email, phoneNo, role, password) VALUES (?, ?, ?, ?, ?)";

      const value = [userName, email, phoneNo, role, hashedPassword];
      
      //Register new user
      db.query(query, value, (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error occurred in Database" });
        }

        if (result.affectedRows == 0) {
          return res.status(400).json({ message: "Unable to add new user" });
        }

        //return if user registered 
        return res
          .status(200)
          .json({ message: "New user Registered successfully" });
      });
    } 
    // catch if any error occurred
    catch (err) {
        return res.status(400).json({ message: "Error occurred in hashing password" });
    }
  });
};

module.exports = { userRegister };