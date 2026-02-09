const db = require("../config/mySqlDb");
const { securePassword } = require("../middleware/hasing");

const userRegister =  (req, res) => {
  const { userName, email, phoneNo, role, password } = req.body;

  const constriants = {
    userName: "Name is missing",
    email: "Email is missing",
    phoneNo: "Phone number is missing",
    role: "Role is missing",
    password: "Password is missing",
  };

  //check wheather all constriants are avalible 
  for (let key in constriants) {
    if (!req.body[key]) {
      return res.status(400).json({ message: constriants[key] });
    }
  }

  //Verify the given constriants are valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({message : "Invalid email formate"});
  }

  if(role != 'student' && role != 'admin'){
    return res.status(400).json({message : "Role should be either student or admin"});
  }

  if(phoneNo.length!=10){
    return res.status(400).json({message : "Phone Number must contain 10 digits"})
  }

  if(password.length < 4){
    return res.status(400).json({message : "Password must be at least 4 characters long"});
  }

  const query_1 = "SELECT * FROM users WHERE email = ?";

  //query execution for verify duplicate entry  
  db.query(query_1, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error occured in DataBase" });
    }
    if (result.length > 0) {
      return res.status(400).json({ message: "Email id already exist" });
    }
    try {
      const hashedPassword = await securePassword(password);

      const query =
        "INSERT INTO users (userName, email, phoneNo, role, password) VALUES (?, ?, ?, ?, ?)";

      const value = [userName, email, phoneNo, role, hashedPassword];
      
      //Register new user
      db.query(query, value, (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error occured in DataBase" });
        }

        if (result.affectedRows == 0) {
          return res.status(400).json({ message: "Unable add new user" });
        }

        return res
          .status(200)
          .json({ message: "New user Registered successfully" });
      });
    } catch (err) {
        return res.status(400).json({message : "Error occured in hasing password"})
    }
  });
};

module.exports = { userRegister };
