const db = require('../config/mySqlDb');

const searchStudent = async(req ,res ) => {
    let {name} = req.body;

    //verify user name is mentioned in body of request 
    if(!name){
        return res.status(400).json({message : "Please enter student name"});
    }

    //convert name lowercase
    name = name.toLowerCase();

    // query to select specific student 
    const query = "SELECT * FROM users WHERE userName = ?";

    //query execution
    db.query(query , [name] , (err ,  result) => {
        if(err){
            return res.status(500).json({message : `Error occured : ${err.message}`});
        }

        // verify if there is no such student 
        if(result.length == 0){
            return res.status(404).json({message : "Student not found"});
        }

        // return student information
        return res.status(200).json({message : "Student found" , data : result});
    })

    
}

module.exports = {searchStudent};