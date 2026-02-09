const mysql = require('mysql2');

require('dotenv').config();

const mySqlConnection = mysql.createConnection(
    {
        host : process.env.HOST,
        user : process.env.USER,
        password : process.env.PASS,
        database : process.env.DB

    }
);

mySqlConnection.connect((err)=>{
    if(err){
        console.log(`Error occured in db connection : ${err}`);
        return;
    }
    console.log("Database connected sucessfully ");
    });
    

module.exports = mySqlConnection;