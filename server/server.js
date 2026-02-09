const mySqlConnection = require('./src/config/mySqlDb');
const mongooseConnection = require('./src/config/mongoDb');

const userRoutes = require('./src/routes/userRoutes');
const portfolioRoutes =require('./src/routes/portfolioRoutes')

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app=express();


app.use(express.json());
app.use(cors())

const PORT= process.env.PORT;



app.use('/user', userRoutes);
app.use('/portfolio', portfolioRoutes);

app.listen(PORT , ()=>{
    
    console.log(`Server is running in Port number : ${PORT}`);

})