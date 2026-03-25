const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
let sslConfig;
try {
    // Read the certificate file first
    const caCert = fs.readFileSync(path.join(__dirname, '..', 'certs', 'ca.pem'));
    
    sslConfig = {
        ca: caCert,
        // Set to false if you are using a self-signed certificate
        rejectUnauthorized: true 
    };
} catch (err) {
    console.log(`Error reading SSL certificate: ${err}`);
}

const mySqlConnection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
    port: process.env.DB_PORT || 17934,
    ssl: sslConfig // Pass the object here
});

mySqlConnection.connect((err) => {
    if (err) {
        console.log(`Error occurred in db connection: ${err}`);
        return;
    }
    console.log("Database connected successfully 🚀");
});

module.exports = mySqlConnection;