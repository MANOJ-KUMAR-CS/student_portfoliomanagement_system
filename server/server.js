const mySqlConnection = require('./src/config/mySqlDb');
const mongooseConnection = require('./src/config/mongoDb');

const userRoutes = require('./src/routes/userRoutes');
const portfolioRoutes = require('./src/routes/studentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app=express();


app.use(express.json());
app.use(cors())

const PORT= process.env.PORT;



app.use('/user', userRoutes);
app.use('/student', portfolioRoutes);
app.use('/admin' , adminRoutes);

app.listen(PORT , ()=>{
    
    console.log(`Server is running in Port number : ${PORT}`);

})