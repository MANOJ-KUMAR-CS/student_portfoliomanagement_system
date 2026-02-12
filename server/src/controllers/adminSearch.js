const db = require('../config/mySqlDb');

const searchStudent = async (req, res) => {
    let { name } = req.query;

    // Verify name exists 
    if (!name) {
        return res.status(400).json({ message: "Please enter student name" });
    }

    // Use LIKE for better searching (case-insensitive in most MySQL setups) 
    const query = "SELECT * FROM users WHERE LOWER(userName) LIKE LOWER(?)";

    // Query execution
    db.query(query, [`%${name}%`], (err, result) => {
        if (err) {
            return res.status(500).json({ message: `Error occurred: ${err.message}` });
        }

        // Verify if found 
        if (result.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Return data 
        return res.status(200).json({ message: "Student found", data: result });
    });
}

module.exports = { searchStudent };